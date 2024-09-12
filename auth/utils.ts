'use server';
import { signOut as naSignOut } from '.';

export async function signOut() {
  await naSignOut({ redirectTo: '/' });
}
