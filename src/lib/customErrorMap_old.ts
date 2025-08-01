import { z } from "zod";

const customErrorMap = (((issue: z.core.$ZodIssue, ctx: { defaultError: string }) => {
  
  switch (issue.code) {
    
    case "invalid_type":
      if (
        "received" in issue &&
        (issue.received === "undefined" || issue.received === "null")
      ) {
        return { message: "This field is required" };
      }
      if ("expected" in issue && issue.expected === "string") {
        return { message: "Please enter text" };
      }
      if ("expected" in issue && issue.expected === "number") {
        return { message: "Please enter a number" };
      }
      return { message: `Invalid value type` };

    case "too_small":
      if ("type" in issue && issue.type === "string") {
        return { message: `Minimum ${issue.minimum} characters required` };
      }
      if ("type" in issue && issue.type === "number") {
        return {
          message: `Number must be greater than or equal to ${issue.minimum}`,
        };
      }
      return { message: `Value is too small` };

    case "too_big":
      if ("type" in issue && issue.type === "string") {
        return { message: `Maximum ${issue.maximum} characters allowed` };
      }
      if ("type" in issue && issue.type === "number") {
        return {
          message: `Number must be less than or equal to ${issue.maximum}`,
        };
      }
      return { message: `Value is too large` };

    case "invalid_format":
      if ("validation" in issue && issue.validation === "email") {
        return { message: "Please enter a valid email address" };
      }
      if ("validation" in issue && issue.validation === "url") {
        return { message: "Please enter a valid URL" };
      }
      return { message: "Invalid text format" };

    case "custom":
      return { message: issue.message || "Invalid value" };

    default:
      return { message: ctx.defaultError };
  }
}) as unknown) as z.ZodErrorMap;

export { customErrorMap };