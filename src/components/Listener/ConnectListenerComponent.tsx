import React, { FunctionComponent } from "react";
import UsernameInput from "../UsernameInput";
import RedButton from "../Buttons/RedButton";
import PurpleButton from "../Buttons/PurpleButton";

type ConnectStreamerComponentProps = {
  id: string;
  username: string;
  updateUsername: (value: string) => void;
  isConnectButtonClicked: boolean;
  cancelConnect: () => void;
  handleConnect: () => void;
};

const ConnectStreamerComponent: FunctionComponent<
  ConnectStreamerComponentProps
> = ({
  id,
  username,
  updateUsername,
  isConnectButtonClicked,
  cancelConnect,
  handleConnect,
}) => {
  return (
    <div>
      <UsernameInput id={id} value={username} onChange={updateUsername} />
      {isConnectButtonClicked ? (
        <RedButton text="Cancel" onClick={cancelConnect} />
      ) : (
        <div className="mt-4">
          <PurpleButton text="Connect!" onClick={handleConnect} />
        </div>
      )}
    </div>
  );
};

export default ConnectStreamerComponent;
