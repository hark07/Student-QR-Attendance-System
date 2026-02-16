import React from "react";
import { Link, NavLink } from "react-router-dom";
import { MdDashboard, MdOutlineAssessment } from "react-icons/md";
import { FiUserCheck } from "react-icons/fi";
import { GoPersonAdd } from "react-icons/go";
import { PiListChecksLight } from "react-icons/pi";
import { IoSchoolOutline } from "react-icons/io5";
import { BsQrCode } from "react-icons/bs";
import { TbReportSearch } from "react-icons/tb";

const Sidebar = () => {
  const sidebarLinks = [
    { name: "Attendance", path: "/", icon: <FiUserCheck size={22} /> },
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard size={22} /> },
    {
      name: "Add Student",
      path: "/addStudent",
      icon: <GoPersonAdd size={22} />,
    },
    {
      name: "List Student",
      path: "/listStudent",
      icon: <PiListChecksLight size={22} />,
    },
    {
      name: "College Features",
      path: "/college",
      icon: <IoSchoolOutline size={22} />,
    },
    {
      name: "Generate QR Code",
      path: "/generateqr",
      icon: <BsQrCode size={22} />,
    },
    {
      name: "Student Report",
      path: "/studentReport",
      icon: <TbReportSearch size={22} />,
    },
    {
      name: "Student Scanner",
      path: "/studentScanner",
      icon: <TbReportSearch size={22} />,
    },
  ];

  return (
    <div className="w-64 border-r bg-white pt-3">
      <Link
        to="/"
        className="block text-center text-3xl font-semibold text-indigo-600 mb-4 cursor-pointer"
      >
        Admin Panel
      </Link>

      {sidebarLinks.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-3 transition
            ${
              isActive
                ? "bg-indigo-500/10 text-indigo-600 border-r-4 border-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          {item.icon}
          <span className="text-[18px] font-medium">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
