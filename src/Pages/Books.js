import React, { Fragment, useEffect, useRef, useState } from "react";
import "react-data-table-component-extensions/dist/index.css";
import axios from "axios";
import { useAuth } from "../Components/Auth";
import { useLoader } from "../Components/Loader";
import { Dialog, Transition } from "@headlessui/react";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import {
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from "@mui/material";

const BOOK_FORM_DEFAULT_VALUES = {
  BookName: "",
  AuthorName: "",
  IntrestedArea: "",
  YearOfIssue: 0,
  NoOfCopies: 0,
};

const columns = [
  {
    title: "Book Name",
  },
  {
    title: "Author Name",
  },
  {
    title: "Intrested Area",
  },
  {
    title: "No Of Copies",
  },
  {
    title: "Year Of Issue",
  },
];

const Books = () => {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  const auth = useAuth();
  const loader = useLoader();
  const [data, SetData] = useState([]);
  const [showAddModal, SetshowAddModal] = useState(false);
  const [showUpdateModal, SetshowUpdateModal] = useState(false);
  const [addBookForm, SetAddBookForm] = useState(BOOK_FORM_DEFAULT_VALUES);
  const [UpdateBookForm, SetUpdateBookForm] = useState(
    BOOK_FORM_DEFAULT_VALUES
  );
  const [BooksCount, setBooksCount] = useState(0);
  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    searchText: "",
  });
  const cancelButtonRef = useRef(null);
  let _headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth.user.Token,
    },
  };
  useEffect(() => {
    fetchBooks();
  }, [controller]);

  const fetchBooks = () => {
    loader.setLoading(true);
    axios
      .get(
        `/Books/GetBooksPaginated?pageNumber=${controller.page}&pageSize=${controller.rowsPerPage}&searchText=${controller.searchText}`,
        _headers
      )
      .then((res) => {
        loader.setLoading(false);
        SetData(res.data.data);
        setBooksCount(parseInt(res.data.totalCount));
      })
      .catch((error) => {
        console.error(error);
        loader.setLoading(false);
      });
  };
  const handleAddChange = (e) => {
    SetAddBookForm((oldValues) => ({
      ...oldValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateChange = (e) => {
    SetUpdateBookForm((oldValues) => ({
      ...oldValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    loader.setLoading(true);
    axios
      .post("/Books/addBook", JSON.stringify(addBookForm), _headers)
      .then((response) => {
        fetchBooks();
        Swal.fire("Book saved successfully", "", "success");
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

  const handleUpdateBook = (e) => {
    e.preventDefault();
    loader.setLoading(true);
    axios
      .put(
        `/Books/${UpdateBookForm.Id}`,
        JSON.stringify({
          BookName: UpdateBookForm.BookName,
          AuthorName: UpdateBookForm.AuthorName,
          IntrestedArea: UpdateBookForm.IntrestedArea,
          NoOfCopies: UpdateBookForm.NoOfCopies,
          YearOfIssue: UpdateBookForm.YearOfIssue,
        }),
        _headers
      )
      .then((response) => {
        if (response.data.message === "Book updated successfully") {
          Swal.fire("Book updated successfully", "", "success");
        }
        fetchBooks();
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

  const handleDeleteBook = (id) => {
    loader.setLoading(true);
    axios
      .delete(`/Books/${id}`, _headers)
      .then((response) => {
        fetchBooks();
        Swal.fire("Book deleted successfully", "", "success");
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

  const handleSearchChange = (searchText) => {
    setController({
      ...controller,
      searchText: searchText,
    });
  };

  const handlePageChange = (event, newPage) => {
    setController({
      ...controller,
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  const handleAddBookButtonClick = () => {
    SetAddBookForm(BOOK_FORM_DEFAULT_VALUES);
    SetshowAddModal(true);
  };
  const handleUpdateBookButtonClick = (id) => {
    SetUpdateBookForm(BOOK_FORM_DEFAULT_VALUES);
    loader.setLoading(true);
    axios
      .get(`/Books/GetById/${id}`, _headers)
      .then((response) => {
        loader.setLoading(false);
        SetUpdateBookForm(response.data);
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
                        Add new Book
                        <span
                          className="float-right cursor-pointer"
                          onClick={() => SetshowAddModal(false)}
                        >
                          <IoClose color="red"></IoClose>
                        </span>
                      </Dialog.Title>
                      <div className="mt-2">
                        <form onSubmit={(e) => handleAddBook(e)}>
                          <div className="sm:flex gap-2 mt-2  ">
                            <div>
                              <label
                                htmlFor="BookName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Book Name
                              </label>
                              <input
                                type="text"
                                name="BookName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Storm Breaker"
                                value={addBookForm.BookName || ""}
                                onChange={handleAddChange}
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="AuthorName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Author Name
                              </label>
                              <input
                                type="text"
                                name="AuthorName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="John Parker"
                                value={addBookForm.AuthorName || ""}
                                onChange={handleAddChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="sm:flex gap-2 mt-2">
                            <div>
                              <label
                                htmlFor="IntrestedArea"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Intrested Area
                              </label>
                              <input
                                type="text"
                                name="IntrestedArea"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Science Fiction"
                                value={addBookForm.IntrestedArea || ""}
                                onChange={handleAddChange}
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="NoOfCopies"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                No Of Copies
                              </label>
                              <input
                                type="Number"
                                name="NoOfCopies"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={addBookForm.NoOfCopies || 0}
                                onChange={handleAddChange}
                                min={0}
                                required
                              />
                            </div>
                          </div>
                          <div className="sm:flex gap-2 mt-2">
                            <div>
                              <label
                                htmlFor="YearOfIssue"
                                className="block mb-2 text-sm align-middle font-medium text-gray-900 dark:text-gray-300"
                              >
                                Year Of Issue
                              </label>
                              <input
                                type="text"
                                name="YearOfIssue"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={addBookForm.YearOfIssue || ""}
                                onChange={handleAddChange}
                                required
                              />
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
            sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Add new Book
                        <span
                          className="float-right cursor-pointer"
                          onClick={() => SetshowUpdateModal(false)}
                        >
                          <IoClose color="red"></IoClose>
                        </span>
                      </Dialog.Title>
                      <div className="mt-2">
                        <form onSubmit={(e) => handleUpdateBook(e)}>
                          <div className="sm:flex gap-2 mt-2  ">
                            <div>
                              <label
                                htmlFor="BookName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Book Name
                              </label>
                              <input
                                type="text"
                                name="BookName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Storm Breaker"
                                value={UpdateBookForm.BookName || ""}
                                onChange={handleUpdateChange}
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="AuthorName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Author Name
                              </label>
                              <input
                                type="text"
                                name="AuthorName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="John Parker"
                                value={UpdateBookForm.AuthorName || ""}
                                onChange={handleUpdateChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="sm:flex gap-2 mt-2">
                            <div>
                              <label
                                htmlFor="IntrestedArea"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Intrested Area
                              </label>
                              <input
                                type="text"
                                name="IntrestedArea"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Science Fiction"
                                value={UpdateBookForm.IntrestedArea || ""}
                                onChange={handleUpdateChange}
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="NoOfCopies"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                No Of Copies
                              </label>
                              <input
                                type="Number"
                                name="NoOfCopies"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={UpdateBookForm.NoOfCopies || 0}
                                onChange={handleUpdateChange}
                                min={0}
                                required
                              />
                            </div>
                          </div>
                          <div className="sm:flex gap-2 mt-2">
                            <div>
                              <label
                                htmlFor="YearOfIssue"
                                className="block mb-2 text-sm align-middle font-medium text-gray-900 dark:text-gray-300"
                              >
                                Year Of Issue
                              </label>
                              <input
                                type="text"
                                name="YearOfIssue"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={UpdateBookForm.YearOfIssue || ""}
                                onChange={handleUpdateChange}
                                required
                              />
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
      {/* <div>
        <div className="overflow-x-auto">
          <div className="float-right mt-2">
            <button
              className="mr-12 text-white bg-slate-600 hover:bg-slate-800 shadow-sm px-2 py-2 rounded-lg font-medium text-sm"
              onClick={() => handleAddBookButtonClick()}
            >
              Add New Book
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
                      <span className="inline-flex items-center ">
                        Book Name
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                    >
                      <span className="inline-flex items-center ">
                        Author Name
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                    >
                      <span className="inline-flex items-center ">
                        Intrested Area
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                    >
                      <span className="inline-flex items-center ">
                        Number Of Copies
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                    >
                      <span className="inline-flex items-center ">
                        Year Of Issue
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
                    >
                      <span className="inline-flex items-center ">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((book, index) => {
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 text-center text-sm text-gray-800 whitespace-nowrap">
                          {`${book.BookName}`}
                        </td>
                        <td className="px-3 py-4 text-center text-sm text-gray-800 whitespace-nowrap">
                          {`${book.AuthorName}`}
                        </td>
                        <td className="px-3 py-4 text-center text-sm text-gray-800 whitespace-nowrap">
                          {`${book.IntrestedArea}`}
                        </td>
                        <td className="px-3 py-4 text-center text-sm text-gray-800 whitespace-nowrap">
                          {`${book.NoOfCopies}`}
                        </td>
                        <td className="px-3 py-4 text-center text-sm text-gray-800 whitespace-nowrap">
                          {`${book.YearOfIssue}`}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                          <button
                            type="button"
                            className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-3 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-sm shadow-cyan-500/50 dark:shadow-lg dark:shadow-gray-800/80 font-medium rounded-lg text-sm px-2 py-2 text-center mr-2 mb-2 "
                            onClick={() => handleUpdateBookButtonClick(book.Id)}
                          >
                            Edit Book
                          </button>
                          <button
                            type="button"
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-3 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-sm shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-2 py-2 text-center mr-2 mb-2"
                            onClick={() => handleDeleteBook(book.Id)}
                          >
                            Delete Book
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
      </div> */}
      {data && (
        <div className="overflow-x-auto">
          <div className="p-1.5 w-full inline-block align-middle">
            <div className="flex mb-2 mt-2 mr-10 ml-10">
              <div className="pr-10 w-full">
                <label htmlFor="search">Search:</label>
                <input
                  type="text"
                  name="search"
                  className="w-1/5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={controller.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <button
                className="text-white h-min align-bottom bg-slate-600 hover:bg-slate-800 shadow-sm px-2 py-2 rounded-lg font-medium text-sm"
                onClick={() => handleAddBookButtonClick()}
              >
                Add New Book
              </button>
            </div>
            <div className="overflow-hidden border rounded-lg mr-10 ml-10">
              <Card>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Book Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Author Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Intrested Area
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Number Of Copies
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Year Of Issue
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((book) => (
                      <TableRow key={book.Id}>
                        <TableCell>{book.BookName}</TableCell>
                        <TableCell>{book.AuthorName}</TableCell>
                        <TableCell>{book.IntrestedArea}</TableCell>
                        <TableCell>{book.NoOfCopies}</TableCell>
                        <TableCell>{book.YearOfIssue}</TableCell>
                        <TableCell>
                          <button
                            type="button"
                            className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-3 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-sm shadow-cyan-500/50 dark:shadow-lg dark:shadow-gray-800/80 font-medium rounded-lg text-sm px-2 py-2 text-center mr-2 mb-2 "
                            onClick={() => handleUpdateBookButtonClick(book.Id)}
                          >
                            Edit Book
                          </button>
                          <button
                            type="button"
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-3 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-sm shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-2 py-2 text-center mr-2 mb-2"
                            onClick={() => handleDeleteBook(book.Id)}
                          >
                            Delete Book
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  onPageChange={handlePageChange}
                  page={controller.page}
                  count={BooksCount}
                  rowsPerPage={controller.rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Books;
