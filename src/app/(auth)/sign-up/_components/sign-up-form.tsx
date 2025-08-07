"use client";

import {
  signUpDefaultValues,
  signUpSchema,
  SignUpSchema,
} from "@/app/(auth)/sign-up/_types/signUpSchema";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSignUp } from "../_services/use-sign-up-mutation";

const SignUpForm = () => {

  const form = useForm<SignUpSchema>({    // El form recibe los datos según un tipo inferido de signUpSchema. En este punto no están validados
    defaultValues: signUpDefaultValues,
    resolver: zodResolver(signUpSchema),  // El Resolver recibe los datos y los valida contra signUpSchema -> si todo es correcto los transforma a tipo de salida signupSchema
  });

  const signUpMutation = useSignUp();

  const onSubmit: SubmitHandler<SignUpSchema> = (data) => {
    signUpMutation.mutate(data);
  };

  return (
    // El FormProvider recibe todos los métodos (handleSubmit y control) y el estado del formulario (values, errors, isDirty, touchedFields)
    <FormProvider {...form}>
      <form
        className="w-full max-w-96 space-y-5 rounded-md border px-10 py-12"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="text-center">
          <h2 className="mb-1 text-2xl font-semibold">Create Account</h2>
          <p className="text-muted-foreground text-sm">
            Sign up to get started
          </p>
        </div>

        <div className="space-y-3">
          <ControlledInput<SignUpSchema> 
            name="name" 
            label="Full Name" 
          />
          <ControlledInput<SignUpSchema> 
            name="email" 
            label="Email" 
          />
          <ControlledInput<SignUpSchema>
            name="password"
            label="Password"
            type="password"
          />
          <ControlledInput<SignUpSchema>
            name="confirmPassword"
            label="Confirm Password"
            type="password"
          />
        </div>

        <Button className="w-full" isLoading={signUpMutation.isPending}>
          Sign Up
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

export { SignUpForm };