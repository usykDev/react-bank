import React from "react";

export const REG_EXP_EMAIL = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

export const REG_EXP_PASSWORD = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
);
