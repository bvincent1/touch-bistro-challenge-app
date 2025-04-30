import { describe, it, vi, expect } from "vitest";
import { Request, Response } from "express";
import { type drizzle } from "drizzle-orm/node-postgres";

import { handleGetAll, handleGet } from "./handlers";
describe("quizzes handlers", () => {
  describe("#handleGetAll", () => {
    it("should call response with 200 and json data", async () => {
      const json = vi.fn();
      const status = vi.fn(() => ({
        json,
      }));

      const leftJoin = vi.fn(() => Promise.resolve([]));
      const from = vi.fn(() => ({
        leftJoin,
      }));
      const select = vi.fn(() => ({
        from,
      }));
      await handleGetAll(
        {} as Request,
        { status } as unknown as Response,
        {
          select,
        } as unknown as ReturnType<typeof drizzle>
      );

      expect(status).toBeCalledWith(200);
      expect(json).toBeCalledWith([]);
    });
  });

  describe("#handleGet", () => {
    it("should call response with 404 and [null] json data", async () => {
      const json = vi.fn();
      const status = vi.fn(() => ({
        json,
      }));

      const where = vi.fn(() => Promise.resolve([]));
      const leftJoin = vi.fn(() => ({ where }));
      const from = vi.fn(() => ({
        leftJoin,
      }));
      const select = vi.fn(() => ({
        from,
      }));
      await handleGet(
        { params: { id: "test" } } as unknown as Request<{ id: string }>,
        { status } as unknown as Response,
        {
          select,
        } as unknown as ReturnType<typeof drizzle>
      );

      expect(status).toBeCalledWith(404);
      expect(json).toBeCalledWith(null);
    });
  });
});
