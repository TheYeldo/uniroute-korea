"use client";

import { defaultProfile } from "@/data/defaults";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import type {
  PersonalNote,
  RoadmapTask,
  SavedUniversity,
  TrackedDocument,
  UserProfile,
} from "@/types/domain";
import type { User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "uniroute-korea:personal-data:v1";

export interface UserSettings {
  timezone: string;
  currency: "KRW" | "USD";
  dateFormat: "dd.MM.yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd";
  defaultIntake: "spring" | "fall";
  inAppNotifications: boolean;
  emailNotifications: boolean;
}

interface PersonalState {
  profile: UserProfile;
  savedUniversities: SavedUniversity[];
  roadmapTasks: RoadmapTask[];
  documents: TrackedDocument[];
  notes: PersonalNote[];
  comparisons: string[][];
  settings: UserSettings;
}

const initialState: PersonalState = {
  profile: defaultProfile,
  savedUniversities: [],
  roadmapTasks: [],
  documents: [],
  notes: [],
  comparisons: [],
  settings: {
    timezone: "Asia/Almaty",
    currency: "KRW",
    dateFormat: "dd.MM.yyyy",
    defaultIntake: "fall",
    inAppNotifications: true,
    emailNotifications: false,
  },
};

interface PersonalDataContextValue extends PersonalState {
  hydrated: boolean;
  user: User | null;
  setProfile: (profile: UserProfile) => void;
  saveUniversity: (universityId: string) => void;
  removeUniversity: (universityId: string) => void;
  updateSavedUniversity: (item: SavedUniversity) => void;
  setRoadmapTasks: (items: RoadmapTask[]) => void;
  upsertRoadmapTask: (item: RoadmapTask) => void;
  removeRoadmapTask: (id: string) => void;
  setDocuments: (items: TrackedDocument[]) => void;
  upsertDocument: (item: TrackedDocument) => void;
  removeDocument: (id: string) => void;
  upsertNote: (item: PersonalNote) => void;
  removeNote: (id: string) => void;
  saveComparison: (ids: string[]) => void;
  setSettings: (settings: UserSettings) => void;
  clearGuestData: () => void;
  exportData: () => PersonalState;
}

const PersonalDataContext = createContext<PersonalDataContextValue | null>(null);

function parseStoredState(value: string | null): PersonalState {
  if (!value) return initialState;
  try {
    const parsed = JSON.parse(value) as Partial<PersonalState>;
    return {
      ...initialState,
      ...parsed,
      profile: { ...initialState.profile, ...parsed.profile },
      settings: { ...initialState.settings, ...parsed.settings },
    };
  } catch {
    return initialState;
  }
}

export function PersonalDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersonalState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setState(parseStoredState(window.localStorage.getItem(STORAGE_KEY)));
      setHydrated(true);
    });
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) =>
      setUser(nextSession?.user ?? null),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  useEffect(() => {
    if (!hydrated || !user) return;
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    const timer = window.setTimeout(() => {
      void supabase.from("profiles").upsert({
        id: user.id,
        country: state.profile.country,
        city: state.profile.city,
        school_grade: state.profile.grade,
        graduation_year: state.profile.graduationYear,
        interface_language: state.profile.interfaceLanguage,
        grading_system: state.profile.gradingSystem,
        average_grade: state.profile.averageGrade,
        english_level: state.profile.englishLevel,
        ielts_score: state.profile.ieltsScore,
        toefl_score: state.profile.toeflScore,
        korean_level: state.profile.koreanLevel,
        topik_level: state.profile.topikScore,
        degree_level: state.profile.degreeLevel,
        preferred_major: state.profile.preferredMajor,
        target_intake: state.profile.targetIntake,
        admission_year: state.profile.admissionYear,
        annual_tuition_budget: state.profile.annualTuitionBudget,
        monthly_living_budget: state.profile.monthlyLivingBudget,
        scholarship_required: state.profile.scholarshipRequired,
        onboarding_complete: state.profile.onboardingComplete,
      });
      if (state.savedUniversities.length) {
        void supabase.from("saved_universities").upsert(
          state.savedUniversities.map((item) => ({
            user_id: user.id,
            university_id: item.universityId,
            priority: item.priority,
            application_status: item.status,
            selected_program_id: item.selectedProgramId ?? null,
            notes: item.notes,
            advantages: item.advantages,
            concerns: item.concerns,
            target_intake: item.targetIntake,
            scholarship_plan: item.scholarshipPlan,
          })),
          { onConflict: "user_id,university_id" },
        );
      }
      if (state.roadmapTasks.length) {
        void supabase.from("roadmap_tasks").upsert(
          state.roadmapTasks.map((item) => ({
            id: item.id,
            user_id: user.id,
            title: item.title,
            description: item.description,
            category: item.category,
            due_at: item.deadline || null,
            status: item.status,
            priority: item.priority,
            university_id: item.universityId ?? null,
            source_id: item.sourceId ?? null,
            notes: item.notes,
            dependencies: item.dependencies,
            is_suggested: item.suggested,
          })),
        );
      }
      if (state.documents.length) {
        void supabase.from("documents").upsert(
          state.documents.map((item) => ({
            id: item.id,
            user_id: user.id,
            name: item.name,
            status: item.status,
            due_at: item.dueDate || null,
            notes: item.notes,
            translation_required: item.translationRequired,
            notarization_required: item.notarizationRequired,
            apostille_required: item.apostilleRequired,
            expires_at: item.expirationDate,
            file_upload_status: item.fileUploadStatus,
          })),
        );
      }
      if (state.notes.length) {
        void supabase.from("notes").upsert(
          state.notes.map((item) => ({
            id: item.id,
            user_id: user.id,
            title: item.title,
            content: item.content,
            entity_type: item.entityType,
            entity_id: item.entityId ?? null,
            pinned: item.pinned,
            updated_at: item.updatedAt,
          })),
        );
      }
    }, 900);
    return () => window.clearTimeout(timer);
  }, [hydrated, state, user]);

  const mutate = useCallback(
    (recipe: (current: PersonalState) => PersonalState) => setState((current) => recipe(current)),
    [],
  );
  const value = useMemo<PersonalDataContextValue>(
    () => ({
      ...state,
      hydrated,
      user,
      setProfile: (profile) => mutate((current) => ({ ...current, profile })),
      saveUniversity: (universityId) =>
        mutate((current) =>
          current.savedUniversities.some((item) => item.universityId === universityId)
            ? current
            : {
                ...current,
                savedUniversities: [
                  ...current.savedUniversities,
                  {
                    universityId,
                    priority: "medium",
                    status: "shortlisted",
                    notes: "",
                    advantages: "",
                    concerns: "",
                    targetIntake: `${current.profile.targetIntake} ${current.profile.admissionYear}`,
                    scholarshipPlan: "",
                  },
                ],
              },
        ),
      removeUniversity: (universityId) =>
        mutate((current) => ({
          ...current,
          savedUniversities: current.savedUniversities.filter(
            (item) => item.universityId !== universityId,
          ),
        })),
      updateSavedUniversity: (item) =>
        mutate((current) => ({
          ...current,
          savedUniversities: current.savedUniversities.map((existing) =>
            existing.universityId === item.universityId ? item : existing,
          ),
        })),
      setRoadmapTasks: (roadmapTasks) => mutate((current) => ({ ...current, roadmapTasks })),
      upsertRoadmapTask: (item) =>
        mutate((current) => ({
          ...current,
          roadmapTasks: current.roadmapTasks.some((existing) => existing.id === item.id)
            ? current.roadmapTasks.map((existing) => (existing.id === item.id ? item : existing))
            : [...current.roadmapTasks, item],
        })),
      removeRoadmapTask: (id) =>
        mutate((current) => ({
          ...current,
          roadmapTasks: current.roadmapTasks.filter((item) => item.id !== id),
        })),
      setDocuments: (documents) => mutate((current) => ({ ...current, documents })),
      upsertDocument: (item) =>
        mutate((current) => ({
          ...current,
          documents: current.documents.some((existing) => existing.id === item.id)
            ? current.documents.map((existing) => (existing.id === item.id ? item : existing))
            : [...current.documents, item],
        })),
      removeDocument: (id) =>
        mutate((current) => ({
          ...current,
          documents: current.documents.filter((item) => item.id !== id),
        })),
      upsertNote: (item) =>
        mutate((current) => ({
          ...current,
          notes: current.notes.some((existing) => existing.id === item.id)
            ? current.notes.map((existing) => (existing.id === item.id ? item : existing))
            : [item, ...current.notes],
        })),
      removeNote: (id) =>
        mutate((current) => ({
          ...current,
          notes: current.notes.filter((item) => item.id !== id),
        })),
      saveComparison: (ids) =>
        mutate((current) => ({
          ...current,
          comparisons: current.comparisons.some((existing) => existing.join(",") === ids.join(","))
            ? current.comparisons
            : [...current.comparisons, ids],
        })),
      setSettings: (settings) => mutate((current) => ({ ...current, settings })),
      clearGuestData: () => setState(initialState),
      exportData: () => state,
    }),
    [hydrated, mutate, state, user],
  );

  return <PersonalDataContext.Provider value={value}>{children}</PersonalDataContext.Provider>;
}

export function usePersonalData() {
  const value = useContext(PersonalDataContext);
  if (!value) throw new Error("usePersonalData must be used inside PersonalDataProvider");
  return value;
}
