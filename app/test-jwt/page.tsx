"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { setJWT, parseJWTPayload } from "@/lib/auth/jwt-utils";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function SetJWTPage() {
  const [jwt, setJwtInput] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [payload, setPayload] = useState<any>(null);
  const [storeCtx, setStoreCtx] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to show current cookie state when page loads
    const match = document.cookie.match(/(?:^|; )storeCtx=([^;]+)/);
    setStoreCtx(match ? decodeURIComponent(match[1]) : null);
  }, []);

  const handleSetJWT = () => {
    try {
      if (!jwt.trim()) {
        setMessage({ type: "error", text: "Please enter a JWT token" });
        return;
      }

      // Parse and verify it's a valid JWT format
      const parts = jwt.split(".");
      if (parts.length !== 3) {
        setMessage({
          type: "error",
          text: "Invalid JWT format. JWT should have 3 parts separated by dots.",
        });
        return;
      }

      // Parse payload to show user info
      const parsedPayload = parseJWTPayload(jwt);
      setPayload(parsedPayload);

      // Set JWT in both localStorage and cookies
      setJWT(jwt);

      setMessage({
        type: "success",
        text: "JWT token set successfully! You can now navigate to protected pages.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to set JWT token. Please check the format.",
      });
      console.error("Error setting JWT:", error);
    }
  };

  const handleClear = () => {
    setJwtInput("");
    setPayload(null);
    setMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Set / Inspect JWT Token</CardTitle>
          <CardDescription>
            For testing: Paste a JWT from your backend. Transitional storeCtx
            cookie visibility included.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jwt">JWT Token</Label>
            <Input
              id="jwt"
              type="text"
              placeholder="Paste your JWT token here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
              value={jwt}
              onChange={(e) => setJwtInput(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSetJWT} className="flex-1">
              Set JWT Token
            </Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          </div>

          {message && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {payload && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Decoded JWT Payload</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(payload, null, 2)}
                </pre>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Email:</span>
                    <span>{payload.sub || payload.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Role:</span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs">
                      {payload.role || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Store ID:</span>
                    <span>{payload.storeId || "Not assigned"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Branch ID:</span>
                    <span>{payload.branchId || "Not assigned"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Transitional storeCtx Cookie
              </CardTitle>
              <CardDescription>
                Shows if the temporary bridging cookie is present while waiting
                for backend to refresh JWT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <span className="font-semibold">storeCtx:</span>{" "}
                {storeCtx ? (
                  <span className="font-mono">{storeCtx}</span>
                ) : (
                  <span className="italic opacity-70">(none)</span>
                )}
                {storeCtx && !payload?.storeId && (
                  <span className="ml-2 text-amber-600 text-xs">
                    (active bridge – storeId missing in JWT)
                  </span>
                )}
                {storeCtx && payload?.storeId && (
                  <span className="ml-2 text-green-600 text-xs">
                    (JWT now authoritative, cookie will self-expire)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md text-sm space-y-2">
            <p className="font-semibold">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                Login via Postman and copy the JWT token from the response
              </li>
              <li>Paste the JWT token in the input field above</li>
              <li>Click "Set JWT Token"</li>
              <li>
                Navigate to protected pages - middleware will now authenticate
                you
              </li>
            </ol>
          </div>

          {/* Onboarding flow removed; note deleted. */}
        </CardContent>
      </Card>
    </div>
  );
}
