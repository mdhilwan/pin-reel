'use server';

import {redirect} from "next/navigation";

export async function handleNewPin(formData: FormData) {
  const res = await fetch('http://localhost:3000/api/new-pin', {
    method: 'POST',
    body: formData,
  });

  if (res.ok) {
    redirect('/');
  } else {
    throw new Error('Failed to create pin');
  }
}