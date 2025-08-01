"use client";

import React, { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginWrapper(): React.ReactElement {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
