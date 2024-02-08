import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useDisconnect } from "wagmi";
import { YourApp } from "../General/ConnectButton";
import { Icon } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import Logo from "../../public/DC2.jpg";
import { MdGroupAdd } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Sidebar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const { disconnect } = useDisconnect();

  return (
    <div>
      {/* <div className="bg-blue-300 flex flex-col max-w-[30px]">
        <p
         
        >
          {!session && (
            <>
              <span>
                You are not signed in
              </span>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                />
              )}
              <span>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
              <a
                href={`/api/auth/signout`}
                onClick={(e) => {
                  e.preventDefault()
                  disconnect()
                  signOut()
                }}
              >
                Sign out
              </a>
            </>
          )}
        </p>
      </div>*/}
      <div className="bg-black flex flex-col h-full py-6 px-4 min-w-[6vw]" >
        <Image src={Logo.src} boxSize={14} rounded="full" />
        <div className="mt-32">
          <ul className="space-y-10">
            <li>
              <YourApp />
            </li>
            <li>
              <Icon
                className="hover:cursor-pointer"
                as={FaPeopleGroup}
                boxSize={14}
                borderRadius="50%"
                color="teal.400"
                backgroundColor="gray.800"
                padding={2}
              />
            </li>
            <li>
              <Icon
                className="hover:cursor-pointer"
                as={MdGroupAdd}
                boxSize={14}
                borderRadius="50%"
                color="teal.400"
                backgroundColor="gray.800"
                padding={2}
              />
            </li>
          </ul>
        </div>
      </div>
   </div>
  );
}
