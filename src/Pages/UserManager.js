import React, { Fragment, useEffect, useState, useRef } from "react";
import "react-data-table-component-extensions/dist/index.css";
import axios from "axios";
import { useAuth } from "../Components/Auth";
import { useLoader } from "../Components/Loader";
import { ADMIN_ROLE, STAFF_ROLE } from "../Constants";
import Swal from "sweetalert2";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
const columns = [
  {
    name: "Book Names",
    selector: (row) => row.BookName,
    reorder: true,
    sortable: true,
  },
  {
    name: "Author Name",
    selector: (row) => row.AuthorName,
    reorder: true,
    sortable: true,
  },
  {
    name: "Intrested Area",
    selector: (row) => row.IntrestedArea,
    reorder: true,
    sortable: true,
  },
  {
    name: "Number of Copies",
    selector: (row) => row.NoOfCopies,
    reorder: true,
    sortable: true,
  },
  {
    name: "Year of Issue",
    selector: (row) => row.YearOfIssue,
    reorder: true,
    sortable: true,
  },
];

const USER_FORM_DEFAULT_VALUES = {
  FirstName: "",
  LastName: "",
  Username: "",
  Password: "",
  Role: "",
};

const UserManager = () => {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  const auth = useAuth();
  const loader = useLoader();
  const [data, SetData] = useState([]);
  const [showAddModal, SetshowAddModal] = useState(false);
  const [showUpdateModal, SetshowUpdateModal] = useState(false);
  const [addUserForm, SetAddUserForm] = useState(USER_FORM_DEFAULT_VALUES);
  const [UpdateUserForm, SetUpdateUserForm] = useState(
    USER_FORM_DEFAULT_VALUES
  );
  const cancelButtonRef = useRef(null);
  let _headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth.user.Token,
    },
  };

  const fetchUsers = () => {
    axios
      .get("/Users", _headers)
      .then((res) => {
        loader.setLoading(false);
        SetData(res.data);
      })
      .catch((error) => {
        console.error(error);
        loader.setLoading(false);
      });
  };

  const handleAddChange = (e) => {
    SetAddUserForm((oldValues) => ({
      ...oldValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateChange = (e) => {
    SetUpdateUserForm((oldValues) => ({
      ...oldValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    loader.setLoading(true);
    axios
      .post("/Books/addBook", JSON.stringify(addUserForm), _headers)
      .then((response) => {
        fetchUsers();
        Swal.fire("User saved successfully", "", "success");
        loader.setLoading(false);
        SetshowAddModal(false);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          loader.setLoading(false);
          Swal.fire("", `${error.response.data.message}.`, "error");
        } else {
          loader.setLoading(false);
          Swal.fire(
            "Some error occurred",
            "Please try again later or contact support.",
            "error"
          );
        }
      });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    loader.setLoading(true);
    axios
      .put(
        `/Users/${UpdateUserForm.Id}`,
        JSON.stringify({
          FirstName: UpdateUserForm.FirstName,
          LastName: UpdateUserForm.LastName,
          Username: UpdateUserForm.Username,
          Password:
            UpdateUserForm.Password?.length === undefined
              ? ""
              : UpdateUserForm?.Password,
          Role: UpdateUserForm.Role,
        }),
        _headers
      )
      .then((response) => {
        if (response.data.message === "User updated successfully") {
          Swal.fire("User updated successfully", "", "success");
        }
        fetchUsers();
        loader.setLoading(false);
        SetshowUpdateModal(false);
      })
      .catch((error) => {
        SetshowUpdateModal(false);
        if (error.response.status === 400) {
          loader.setLoading(false);
          Swal.fire("", `${error.response.data.message}.`, "error");
        } else {
          loader.setLoading(false);
          Swal.fire(
            "Some error occurred",
            "Please try again later or contact support.",
            "error"
          );
        }
        loader.setLoading(false);
      });
  };

  const handleDeleteUser = (id) => {
    loader.setLoading(true);
    axios
      .delete(`/Users/${id}`, _headers)
      .then((response) => {
        fetchUsers();
        Swal.fire("User deleted successfully", "", "success");
        loader.setLoading(false);
      })
      .catch((error) => {
        Swal.fire(
          "Some error occurred",
          "Please try again later or contact support.",
          "error"
        );
        loader.setLoading(false);
      });
  };

  const handleAddUserButtonClick = () => {
    SetAddUserForm(USER_FORM_DEFAULT_VALUES);
    SetshowAddModal(true);
  };
  const handleUpdateUserButtonClick = (id) => {
    SetUpdateUserForm(USER_FORM_DEFAULT_VALUES);
    loader.setLoading(true);
    axios
      .get(`/Users/GetById/${id}`, _headers)
      .then((response) => {
        loader.setLoading(false);
        SetUpdateUserForm(response.data);
        SetshowUpdateModal(true);
      })
      .catch((error) => {
        loader.setLoading(false);
        Swal.fire(
          "Some error occurred",
          "Please try again later or contact support.",
          "error"
        );
      });
    SetshowUpdateModal(true);
  };

  useEffect(() => {
    loader.setLoading(true);
    fetchUsers();
  }, []);

  return (
    <>
      <Transition.Root show={showAddModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={SetshowAddModal}
        >
          <div
            className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block
         sm:p-0"
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                className="inline-block align-bottom bg-white rounded-lg
               text-left 
            overflow-hidden shadow-xl 
            transform transition-all 
            sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Add new user
                        <span
                          className="float-right cursor-pointer"
                          onClick={() => SetshowAddModal(false)}
                        >
                          <IoClose color="red"></IoClose>
                        </span>
                      </Dialog.Title>
                      <div className="mt-2">
                        <form onSubmit={(e) => handleAddUser(e)}>
                          <div className="sm:flex gap-2 mt-2  ">
                            <div>
                              <label
                                htmlFor="FirstName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                First name
                              </label>
                              <input
                                type="text"
                                name="FirstName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="John"
                                value={addUserForm.FirstName || ""}
                                onChange={handleAddChange}
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="LastName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Last name
                              </label>
                              <input
                                type="text"
                                name="LastName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Parker"
                                value={addUserForm.LastName || ""}
                                onChange={handleAddChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="sm:flex gap-2 mt-2">
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                User name
                              </label>
                              <input
                                type="text"
                                name="Username"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="JohnParker"
                                value={addUserForm.Username || ""}
                                onChange={handleAddChange}
                                autoComplete="nope"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Password
                              </label>
                              <input
                                type="Password"
                                name="Password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={addUserForm.Password || ""}
                                onChange={handleAddChange}
                                autoComplete="new-Password"
                                required
                              />
                            </div>
                          </div>
                          <div className="sm:flex gap-2 mt-2">
                            <div>
                              <label className="block mb-2 text-sm align-middle font-medium text-gray-900 dark:text-gray-300">
                                Role
                              </label>
                              <select
                                name="Role"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={addUserForm.Role || ""}
                                onChange={handleAddChange}
                                required
                              >
                                <option value="">Select</option>
                                <option value={ADMIN_ROLE}>{ADMIN_ROLE}</option>
                                <option value={STAFF_ROLE}>{STAFF_ROLE}</option>
                              </select>
                            </div>
                          </div>
                          <div className="bg-gray-50 py-3">
                            <button
                              type="button"
                              className="mt-3 w-full inline-flex justify-center
                  rounded-md border border-gray-300 shadow-sm px-4 py-2
                   bg-white text-base font-medium text-gray-700
                    hover:bg-gray-50 focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-gray-500 sm:mt-0
                      sm:w-auto sm:text-sm"
                              onClick={() => SetshowAddModal(false)}
                              ref={cancelButtonRef}
                            >
                              Cancel
                            </button>
                            <input
                              type="submit"
                              value="Save"
                              className="w-full inline-flex justify-center rounded-md
                   border border-transparent shadow-sm px-4 py-2 bg-blue-500
                    text-base font-medium text-white hover:bg-blue-600 
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            ></input>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={showUpdateModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={SetshowUpdateModal}
        >
          <div
            className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block
         sm:p-0"
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                className="inline-block align-bottom bg-white rounded-lg
               text-left 
            overflow-hidden shadow-xl 
            transform transition-all 
            sm:my-8 sm:align-middle sm:max-w-xl sm:w-full"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Add new user
                        <span
                          className="float-right cursor-pointer"
                          onClick={() => SetshowUpdateModal(false)}
                        >
                          <IoClose color="red"></IoClose>
                        </span>
                      </Dialog.Title>
                      <div className="mt-2">
                        <form onSubmit={(e) => handleUpdateUser(e)}>
                          <div className="sm:flex gap-2 mt-2  ">
                            <div>
                              <label
                                htmlFor="FirstName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                First name
                              </label>
                              <input
                                type="text"
                                name="FirstName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="John"
                                value={UpdateUserForm.FirstName || ""}
                                onChange={handleUpdateChange}
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="LastName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Last name
                              </label>
                              <input
                                type="text"
                                name="LastName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Parker"
                                value={UpdateUserForm.LastName || ""}
                                onChange={handleUpdateChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="sm:flex gap-2 mt-2">
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                User name
                              </label>
                              <input
                                type="text"
                                name="Username"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="JohnParker"
                                value={UpdateUserForm.Username || ""}
                                onChange={handleUpdateChange}
                                autoComplete="nope"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Password
                              </label>
                              <input
                                type="Password"
                                name="Password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-xs"
                                value={UpdateUserForm.Password || ""}
                                onChange={handleUpdateChange}
                                autoComplete="new-Password"
                                placeholder="Leave blank if you don't want to update"
                              />
                            </div>
                          </div>
                          <div className="sm:flex gap-2 mt-2">
                            <div>
                              <label className="block mb-2 text-sm align-middle font-medium text-gray-900 dark:text-gray-300">
                                Role
                              </label>
                              <select
                                name="Role"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={UpdateUserForm.Role || ""}
                                onChange={handleUpdateChange}
                                required
                              >
                                <option value="">Select</option>
                                <option value={ADMIN_ROLE}>{ADMIN_ROLE}</option>
                                <option value={STAFF_ROLE}>{STAFF_ROLE}</option>
                              </select>
                            </div>
                          </div>
                          <div className="bg-gray-50 py-3">
                            <button
                              type="button"
                              className="mt-3 w-full inline-flex justify-center
                  rounded-md border border-gray-300 shadow-sm px-4 py-2
                   bg-white text-base font-medium text-gray-700
                    hover:bg-gray-50 focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-gray-500 sm:mt-0
                      sm:w-auto sm:text-sm"
                              onClick={() => SetshowUpdateModal(false)}
                              ref={cancelButtonRef}
                            >
                              Cancel
                            </button>
                            <input
                              type="submit"
                              value="Save"
                              className="w-full inline-flex justify-center rounded-md
                   border border-transparent shadow-sm px-4 py-2 bg-blue-500
                    text-base font-medium text-white hover:bg-blue-600 
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            ></input>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {data && (
        <div>
          <div className="overflow-x-auto">
            <div className="float-right mt-2">
              <button
                className="mr-12 text-white bg-slate-600 hover:bg-slate-800 shadow-sm px-2 py-2 rounded-lg font-medium text-sm"
                onClick={() => handleAddUserButtonClick()}
              >
                Add New User
              </button>
            </div>
            <div className="p-1.5 w-full inline-block align-middle">
              <div className="overflow-hidden border rounded-lg mr-10 ml-10">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        <span className="inline-flex items-center ">Name</span>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        <span className="inline-flex items-center ">
                          User Name
                        </span>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        <span className="inline-flex items-center ">Role</span>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                      >
                        <span className="inline-flex items-center ">
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((user, index) => {
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 text-center text-sm text-gray-800 whitespace-nowrap">
                            {`${user.FirstName} ${user.LastName}`}
                          </td>
                          <td className="px-3 py-4 text-center text-sm text-gray-800 whitespace-nowrap">
                            {`${user.Username}`}
                          </td>
                          <td className="px-3 py-4 text-center text-sm text-gray-800 whitespace-nowrap">
                            {`${
                              user.Role === 0
                                ? ADMIN_ROLE
                                : user.Role === 1
                                ? STAFF_ROLE
                                : ""
                            }`}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                            <button
                              type="button"
                              className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-3 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-sm shadow-cyan-500/50 dark:shadow-lg dark:shadow-gray-800/80 font-medium rounded-lg text-sm px-2 py-2 text-center mr-2 mb-2 "
                              onClick={() =>
                                handleUpdateUserButtonClick(user.Id)
                              }
                            >
                              Edit User
                            </button>
                            <button
                              type="button"
                              className="text-white bg-red-700 hover:bg-red-800 focus:ring-3 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-sm shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-2 py-2 text-center mr-2 mb-2"
                              onClick={() => handleDeleteUser(user.Id)}
                            >
                              Delete User
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManager;
