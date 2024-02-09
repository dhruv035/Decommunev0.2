import { Icon, Image } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RiWallet3Line } from "react-icons/ri";
import { GiTerror } from "react-icons/gi";

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
                  <Icon
                    className="hover:cursor-pointer"
                    as={RiWallet3Line}
                    boxSize={14}
                    borderRadius="50%"
                    color="red.400"
                    backgroundColor="gray.800"
                    padding={2}
                    onClick={() => openConnectModal()}
                  />
                );
              }

              if (chain.unsupported) {
                return (
                  <Icon
                    className="hover:cursor-pointer"
                    as={GiTerror}
                    boxSize={14}
                    borderRadius="full"
                    color="red.400"
                    backgroundColor="gray.800"
                    padding={2}
                    onClick={() => openChainModal()}
                  />
                );
              }

              return (
                <div className="flex flex-col bg-gray-900 rounded-[40px] ">
                  <Icon
                    className="hover:cursor-pointer"
                    as={RiWallet3Line}
                    boxSize={14}
                    color="teal.400"
                    padding={2}
                    rounded="full"
                    onClick={() => openAccountModal()}
                  />
                  {chain.hasIcon && chain.iconUrl && (
                    //<img alt={chain.name ?? "Chain icon"} src={chain.iconUrl} style={{ width: 12, height: 12 }}/>

                    <Image
                      alt={chain.name ?? "Chain icon"}
                      src={chain.iconUrl}
                      boxSize={14}
                      backgroundColor="gray.800"
                      onClick={openChainModal}
                      rounded="full"
                      padding={2}
                    />
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
