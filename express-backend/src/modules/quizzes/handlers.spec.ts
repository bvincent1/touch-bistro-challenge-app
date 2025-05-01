import { describe, it, vi, expect } from "vitest";
import { Request, Response } from "express";
import { type drizzle } from "drizzle-orm/node-postgres";

import { handleGetAll, handleGet, reducerFunction } from "./handlers";

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

  describe("#reducerFunction", () => {
    it("should reduce rows into nested objects", () => {
      const result = [
        {
          id: "qi-123",
          title: "name",
          description: "test",
          question: {
            index: 0,
            id: "qe-12",
            quiz_id: "123",
            title: "name",
            description: "test",
            correct_answer: "tests",
          },
        },
        {
          id: "qi-123",
          title: "name",
          description: "test",
          question: {
            index: 1,
            id: "qe-123",
            quiz_id: "123",
            title: "name",
            correct_answer: "tests",
            description: "test",
          },
        },
      ].reduce(reducerFunction, {});

      expect(result).toEqual({
        "qi-123": {
          id: "qi-123",
          title: "name",
          description: "test",
          questions: [
            {
              index: 0,
              id: "qe-12",
              quiz_id: "123",
              title: "name",
              description: "test",
              correct_answer: "tests",
            },
            {
              index: 1,
              id: "qe-123",
              quiz_id: "123",
              title: "name",
              correct_answer: "tests",
              description: "test",
            },
          ],
        },
      });
    });
  });
});
