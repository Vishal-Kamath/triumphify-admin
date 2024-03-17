import { FC } from "react";

const UserTasksSection: FC = () => {
  return (
    <div className="w-full flex-col gap-4 flex">
      <h3 className="text-lg lg:text-xl text-transparent bg-clip-text bg-gradient-to-br from-green-900 to-green-700 font-semibold">
        Tasks
      </h3>
      <div className="rounded-md bg-white p-3 flex-col"></div>
    </div>
  );
};

export default UserTasksSection;
