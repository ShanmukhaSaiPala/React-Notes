import React from "react";
import { getInitials } from "../../utils/helper";
import { IoIosLogOut, IoMdLogOut } from "react-icons/io";

const ProfileInfo = ({ onLogout, userInfo }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-base-content font-medium bg-base-300">
        {getInitials(userInfo?.username)}
      </div>

      <div className="hidden md:block">
        <p className="text-sm font-medium">{userInfo?.username}</p>
      </div>

      <div className="">
        <IoIosLogOut
          className=" text-4xl p-1 rounded-md text-red-600 hover:opacity-80 "
          onClick={onLogout}
        />
      </div>
    </div>
  );
};

export default ProfileInfo;
