import { Icon, Image, Tooltip } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RiWallet3Line } from "react-icons/ri";
import { GiTerror } from "react-icons/gi";

//I basically picked the example code for a stripped down wallet button and modified it
export default function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            className="flex"
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Tooltip label="Connect Wallet">
                    <span>
                      <Icon
                        className="hover:cursor-pointer"
                        as={RiWallet3Line}
                        boxSize={[8,10,14]}
                        borderRadius="50%"
                        color="red.400"
                        backgroundColor="gray.800"
                        padding={2}
                        onClick={() => openConnectModal()}
                      />
                    </span>
                  </Tooltip>
                );
              }

              if (chain.unsupported) {
                return (
                  <Tooltip label="Switch Network">
                    <span>
                      <Icon
                        className="hover:cursor-pointer"
                        as={GiTerror}
                        boxSize={[8,10,14]}
                        borderRadius="full"
                        color="red.400"
                        backgroundColor="gray.800"
                        padding={2}
                        onClick={() => openChainModal()}
                      />
                    </span>
                  </Tooltip>
                );
              }

              return (
                <div className="flex flex-col bg-gray-900 rounded-[40px] ">
                  <Tooltip label="Wallet Details">
                    <span>
                      <Icon
                        className="hover:cursor-pointer"
                        as={RiWallet3Line}
                        boxSize={[8,10,14]}
                        color="teal.400"
                        padding={2}
                        rounded="full"
                        onClick={() => openAccountModal()}
                      />
                    </span>
                  </Tooltip>
                  {chain.hasIcon && chain.iconUrl && (
                    //<img alt={chain.name ?? "Chain icon"} src={chain.iconUrl} style={{ width: 12, height: 12 }}/>

                    <Tooltip label="Supported Networks">
                    <Image
                      alt={chain.name ?? "Chain icon"}
                      src={chain.iconUrl}
                      boxSize={[8,10,14]}
                      _hover={{cursor:"pointer"}}
                      backgroundColor="gray.800"
                      onClick={openChainModal}
                      rounded="full"
                      padding={2}
                    />
                    </Tooltip>
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
