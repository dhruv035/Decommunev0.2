import { useSession } from "next-auth/react";
import { ConnectButton } from "../General";
import { Icon, IconButton, Image, Tooltip } from "@chakra-ui/react";
import Logo from "../../public/DC2.jpg";
import { MdGroupAdd } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {ElementSize} from "@zag-js/element-size"
//Sidebar component, part of the hud and plugged directly to all rendered pages

/*My Reference for NextAuth and Siwe 
  <div className="bg-blue-300 flex flex-col max-w-[30px]">
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
      </div>*/

const Sidebar = ({ windowData }: { windowData: ElementSize|undefined }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";
  return (
    <div className=" flex flex-col py-6 px-2 sm:px-4 bg-[rgba(10,21,20,0.8)]  h-full w-[100%] items-center">
      <IconButton
        onClick={() => {
          router.push("/");
        }}
        aria-label=""
        bg={"transparent"}
        rounded="full"
        boxSize={[16, 20]}
        icon={<Image p={0} rounded="full" src={Logo.src} />}
      ></IconButton>

      <div className="mt-32">
        <ul className="space-y-10">
        <li>
            <Icon
              className="hover:cursor-pointer rounded-full p-1 md:gip-2"
              as={MdGroupAdd}
              boxSize={[16, 20]}
              color={!session ? "red.400" : "teal.400"}
              backgroundColor="gray.800"
              onClick={() => {router.push("/UploadAsset")}}
            />
          </li>

          <li>
            <ConnectButton windowData={windowData} />
          </li>
          <li>
            <Tooltip label="My Network">
              <span>
                <Icon
                  className={"hover:cursor-pointer rounded-full p-1 md:p-2"}
                  as={FaPeopleGroup}
                  boxSize={[16, 20]}
                  color={!session ? "red.400" : "teal.400"}
                  backgroundColor="gray.800"
                  onClick={() => {
                    router.push("/network");
                  }}
                />
              </span>
            </Tooltip>
          </li>
          <li>
            <Tooltip label="Create a Membership NFT">
              <span>
                <Icon
                  className="hover:cursor-pointer rounded-full p-1 md:p-2"
                  as={MdGroupAdd}
                  boxSize={[16, 20]}
                  color={!session ? "red.400" : "teal.400"}
                  backgroundColor="gray.800"
                  onClick={() => {
                    router.push("/create");
                  }}
                />
              </span>
            </Tooltip>
          </li>
          
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
