import { describe, it, vi, expect } from "vitest";
import { Request, Response } from "express";
import { type drizzle } from "drizzle-orm/node-postgres";
import { drizzle as drizzleProxy } from "drizzle-orm/pg-proxy";

import { handleGetAll, handleGet, reducerFunction } from "./handlers";

describe("quizzes handlers", () => {
  describe("#handleGetAll", () => {
    it("should call response with 200 and json data", async () => {
      const json = vi.fn();
      const status = vi.fn(() => ({
        json,
      }));
      await handleGetAll(
        { headers: { "quiz-user": "test" } } as unknown as Request,
        { status } as unknown as Response,
        drizzleProxy(async () => ({ rows: [] })) as unknown as ReturnType<
          typeof drizzle
        >
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

      await handleGet(
        {
          params: { id: "test" },
          headers: { "quiz-user": "test" },
        } as unknown as Request<{ id: string }>,
        { status } as unknown as Response,
        drizzleProxy(async () => ({ rows: [] })) as unknown as ReturnType<
          typeof drizzle
        >
      );

      expect(status).toBeCalledWith(404);
      expect(json).toBeCalledWith(null);
    });
  });

  describe("#reducerFunction", () => {
    it("should reduce rows into nested objects", () => {
      const result = [
        {
          quizzes: {
            id: "qi-123",
            title: "name",
            description: "test",
          },
          nested_questions: {
            index: 0,
            id: "qe-12",
            quiz_id: "123",
            title: "name",
            description: "test",
            correct_answer: "tests",
          },
        },
        {
          quizzes: {
            id: "qi-123",
            title: "name",
            description: "test",
          },
          nested_questions: {
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
