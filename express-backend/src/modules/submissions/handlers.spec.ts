import { describe, it, vi, expect } from "vitest";
import { Request, Response } from "express";
import { type drizzle } from "drizzle-orm/node-postgres";

import { handlePost } from "./handlers";

describe("submissions handlers", () => {
  describe("#handlePost", () => {
    it("should call response with 200 and false", async () => {
      const json = vi.fn();
      const status = vi.fn(() => ({
        json,
      }));

      const where = vi.fn(() => Promise.resolve([]));
      const from = vi.fn(() => ({
        where,
      }));
      const select = vi.fn(() => ({
        from,
      }));
      await handlePost(
        { body: { question_id: "test", answer: "tt" } } as Request,
        { status } as unknown as Response,
        {
          select,
        } as unknown as ReturnType<typeof drizzle>
      );

      expect(status).toBeCalledWith(200);
      expect(json).toBeCalledWith(false);
    });
  });
});
