

import * as Player from "@livepeer/react/player";

import { ClipIcon, LoadingIcon } from "@livepeer/react/assets";
import { ClipPayload } from "livepeer/dist/models/components";
import { useCallback, useState } from "react";
import { useToast } from "@chakra-ui/react";

export function Clip({ className }: { className?: string }) {
  const [pending, setIsPending] = useState(false);
    const toast = useToast();
  const createClipComposed = useCallback(async (opts: ClipPayload) => {
    setIsPending(true);
    try {
      const result = await fetch("/api/clip", {
        method: "POST",
        body: JSON.stringify(opts),
        headers: {
          "content-type": "application/json",
        },
      });

      if (result.ok) {
        const response = await result.json();

        toast({
            position: "top-right",
            title: "Clip Created",
            description:  "You have created a new clip - in a few minutes, you will be able to view it at ",
            status: "success",
            isClosable: true,
            duration: 5000,
          });
       
      } else {
        

        toast({
            position: "top-right",
            title: "Failed",
            description:  "Failed to create a clip. Please try again in a few seconds.",
            status: "error",
            isClosable: true,
            duration: 5000,
          });
       
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  }, []);

  return (
    <Player.LiveIndicator className={className} asChild>
      <Player.ClipTrigger
        onClip={createClipComposed}
        disabled={pending}
        className="hover:scale-110 transition-all flex-shrink-0"
      >
        {pending ? (
          <LoadingIcon className="h-full w-full animate-spin" />
        ) : (
          <ClipIcon className="w-full h-full" />
        )}
      </Player.ClipTrigger>
    </Player.LiveIndicator>
  );
}