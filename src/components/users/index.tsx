import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { columns, renderColumn } from "../../redux/user/interface";
import { getAllUsers, deleteUser } from "../../redux/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import Input from "../form/input/InputField";
import Pagination from "../ui/pagination";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../ui/skeleton/TableSkeleton";



export default function UsersComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string | null) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };


  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    if (!id) return;

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    dispatch(deleteUser(id))
      .unwrap()
      .then(() => {
        dispatch(getAllUsers({ page: 1, limit: 20 }));
      })
      .catch((error) => {
        console.error("Failed to delete FX Provider:", error);
      });
  };


  const { users, pagination, loading } = useSelector(
    (state: RootState) => state.user
  );

  // Load initial messages
  useEffect(() => {
    dispatch(getAllUsers({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  // Search (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getAllUsers({ page: 1, limit: 10, search }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [dispatch, search]);

  return (
    <div>
      <PageMeta
        title="Stahzin Users"
        description="This is Stahzin Users page for Stahzin Application"
      />
      <PageBreadcrumb pageTitle="Users" />


      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

        {/* Search Bar */}
        <div className="flex items-center justify-between mb-6">

          {/* SEARCH INPUT */}
          <div className="w-full max-w-xs">
            <Input
              type="text"
              name="search"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* LIMIT DROPDOWN */}
          <div>
            <select
              value={limit}
              onChange={(e) => {
                setPage(1); // reset to first page
                setLimit(Number(e.target.value));
              }}
              className="border rounded-lg px-3 py-2 ml-3 bg-white text-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>


        <div className="mx-auto w-full overflow-x-auto">

          {loading ? (
            <TableSkeleton rows={8} columns={columns.length} />
          ) : (
            <>
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {users?.map((msg) => (
                    <TableRow key={msg._id}>
                      {columns.map((col) => (
                        <TableCell key={col.key} className="px-5 py-4 text-start">
                          {renderColumn(msg, selected, toggleSelect, navigate, handleDelete, toggleDropdown, openDropdown)[col.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <Pagination
                  currentPage={pagination?.currentPage || 1}
                  totalPages={pagination?.totalPages || 1}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
