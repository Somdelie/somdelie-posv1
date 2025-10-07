"use client";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { getUserProfile } from "@/redux-toolkit/fetures/user/userThunk";
import { useEffect } from "react";
import Link from "next/link";

const HomePageComponent = () => {
  const dispatch = useAppDispatch();

  // Define the UserProfile type according to your user object structure
  type UserProfile = {
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    profileImage?: string;
    role?: string;
    createdAt?: string | number;
    updatedAt?: string | number;
    // add other fields as needed
  };

  const { userProfile: user, loading } = useAppSelector(
    (state: { user: { userProfile: UserProfile | null; loading: boolean } }) =>
      state.user
  );

  // Load user profile on mount
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token && !user) {
      dispatch(getUserProfile(token));
    }
  }, [dispatch, user]);

  console.log(user, "user in HomePageComponent");

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {user ? (
        <Link href="/create-store" className="text-blue-500 underline">
          Create Your Store
        </Link>
      ) : (
        <p>Please log in to access more features.</p>
      )}
    </div>
  );
};

export default HomePageComponent;
