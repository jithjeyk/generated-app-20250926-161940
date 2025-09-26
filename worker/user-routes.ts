import { Hono } from "hono";
import type { Env } from './core-utils';
import { DiaryEntryEntity } from "./entities";
import { ok, bad, notFound, isStr, Index } from './core-utils';
import type { DiaryEntry } from "@shared/types";
// A simple middleware to extract userId. In a real app, this would be from a JWT or session.
// For this project, we'll pass it as a header for simplicity.
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // GET all entries for the user
  app.get('/api/entries', async (c) => {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ success: false, error: 'Unauthorized: Missing X-User-Id header' }, 401);
    }
    const index = new Index<string>(c.env, DiaryEntryEntity.getUserIndexName(userId));
    const ids = await index.list();
    const entries = await Promise.all(
      ids.map(id => new DiaryEntryEntity(c.env, id).getState())
    );
    // Sort by most recently updated
    entries.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return ok(c, entries);
  });
  // POST a new entry
  app.post('/api/entries', async (c) => {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ success: false, error: 'Unauthorized: Missing X-User-Id header' }, 401);
    }
    const { title, encryptedContent } = (await c.req.json()) as Partial<DiaryEntry>;
    if (!isStr(title) || !isStr(encryptedContent)) {
      return bad(c, 'title and encryptedContent are required');
    }
    const now = new Date().toISOString();
    const newEntry: DiaryEntry = {
      id: crypto.randomUUID(),
      userId,
      title,
      encryptedContent,
      createdAt: now,
      updatedAt: now,
    };
    const inst = new DiaryEntryEntity(c.env, newEntry.id);
    await inst.save(newEntry);
    const index = new Index<string>(c.env, DiaryEntryEntity.getUserIndexName(userId));
    await index.add(newEntry.id);
    return ok(c, newEntry);
  });
  // PUT (update) an existing entry
  app.put('/api/entries/:id', async (c) => {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ success: false, error: 'Unauthorized: Missing X-User-Id header' }, 401);
    }
    const entryId = c.req.param('id');
    const { title, encryptedContent } = (await c.req.json()) as Partial<DiaryEntry>;
    if (!isStr(title) || !isStr(encryptedContent)) {
      return bad(c, 'title and encryptedContent are required');
    }
    const inst = new DiaryEntryEntity(c.env, entryId);
    if (!(await inst.exists())) {
      return notFound(c, 'Entry not found');
    }
    const currentState = await inst.getState();
    if (currentState.userId !== userId) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
    const updatedEntryData = {
      ...currentState,
      title,
      encryptedContent,
      updatedAt: new Date().toISOString(),
    };
    await inst.save(updatedEntryData);
    return ok(c, updatedEntryData);
  });
  // DELETE an entry
  app.delete('/api/entries/:id', async (c) => {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ success: false, error: 'Unauthorized: Missing X-User-Id header' }, 401);
    }
    const entryId = c.req.param('id');
    const inst = new DiaryEntryEntity(c.env, entryId);
    if (!(await inst.exists())) {
      return notFound(c, 'Entry not found');
    }
    const currentState = await inst.getState();
    if (currentState.userId !== userId) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
    await inst.delete();
    const index = new Index<string>(c.env, DiaryEntryEntity.getUserIndexName(userId));
    await index.remove(entryId);
    return ok(c, { id: entryId, deleted: true });
  });
}