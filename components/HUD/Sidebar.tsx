import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useDisconnect } from "wagmi";
import { ConnectButton } from "../General";
import { Icon, Image } from "@chakra-ui/react";
import Logo from "../../public/DC2.jpg";
import { MdGroupAdd } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Views, FlowContext } from "../../pages/_app";
// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Sidebar() {
  const flowContext = useContext(FlowContext);
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const handleClick = (view: Views) => {
    flowContext.setFlow(view);
  };
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
      <div className="bg-black flex flex-col h-full py-6 px-4 min-w-[6vw]">
        <Image
          className="hover:cursor-pointer"
          onClick={() => handleClick(Views.HOME)}
          src={Logo.src}
          boxSize={14}
          rounded="full"
        />
        <div className="mt-32">
          <ul className="space-y-10">
            <li>
              <ConnectButton />
            </li>
            <li>
              <Icon
                className={"hover:cursor-pointer rounded-full p-2"}
                as={FaPeopleGroup}
                boxSize={14}
                color={!session ? "red.400" : "teal.400"}
                backgroundColor="gray.800"
                onClick={() => {
                  handleClick(Views.NETWORK);
                }}
              />
            </li>
            <li>
              <Icon
                className="hover:cursor-pointer rounded-full p-2"
                as={MdGroupAdd}
                boxSize={14}
                color={!session ? "red.400" : "teal.400"}
                backgroundColor="gray.800"
                onClick={() => {
                  handleClick(Views.CREATE);
                }}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
