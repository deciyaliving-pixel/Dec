import { isSupabaseConfigured } from "./supabaseClient.js";
import { LocalRepository } from "./localRepository.js";
import { SupabaseRepository } from "./supabaseRepository.js";
import type { ContentRepository } from "./repository.js";

let repository: ContentRepository | null = null;

export function getRepository(): ContentRepository {
  if (!repository) {
    repository = isSupabaseConfigured ? new SupabaseRepository() : new LocalRepository();
  }
  return repository;
}
