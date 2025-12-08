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
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import Input from "../form/input/InputField";
import Pagination from "../ui/pagination";
import TableSkeleton from "../ui/skeleton/TableSkeleton";
import EmptyState from "../ui/empty/EmptyState";
import { columns, renderColumn, IFxEngine } from "../../redux/fx-engine/interface";
import { getAllFxEngines, deleteFxEngine } from "../../redux/fx-engine";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { Link } from 'react-router-dom';
import { PlusIcon } from "../../icons";
import { useNavigate } from "react-router-dom";


export default function FxEngineComponent() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<string | null>(null);
    const [selectedFx, setSelectedFx] = useState<IFxEngine | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (id: string | null) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const handleView = (item: IFxEngine) => {
        setIsModalOpen(true);
        setSelectedFx(item);
        setModalType('view');
        setOpenDropdown(null);
    };

    const handleEdit = (item: IFxEngine) => {
        navigate(`/fx-engine/update/${item._id}`);
        setOpenDropdown(null);
    };

    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };
    const { fxEngines, loading } = useSelector(
        (state: RootState) => state.fxEngine
    );

    useEffect(() => {
        dispatch(getAllFxEngines());
    }, [dispatch]);

    const filteredData = fxEngines?.filter((item) => {
        const term = search.toLowerCase();
        return (
            item.source_country.toLowerCase().includes(term) ||
            item.destination_country.toLowerCase().includes(term) ||
            String(item.rate).includes(term) ||
            String(item.promo_rate).includes(term) ||
            item.fx_provider.toLowerCase().includes(term)
        );
    });

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData?.slice(startIndex, startIndex + limit);

    // Total pages
    const totalPages = Math.ceil((filteredData?.length || 0) / limit);

    const handleDelete = (id: string) => {
        if (!id) return;

        if (!window.confirm("Are you sure you want to delete this item?")) return;

        dispatch(deleteFxEngine(id))
            .unwrap()
            .then(() => {
                setSelectedFx(null);
                setIsModalOpen(false);
                dispatch(getAllFxEngines());
            })
            .catch((error) => {
                console.error("Failed to delete FX Engine:", error);
            });
    };


    return (
        <div>
            <PageMeta title="Stazhin Fx Engine" description="" />
            <PageBreadcrumb pageTitle="Fx Engine" />
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <Button size="sm" className="mb-4" startIcon={<PlusIcon />} variant="primary">
                    <Link to="/fx-engine/add" className="text-white">Add FX Engine</Link>
                </Button>

                <div className="flex items-center justify-between mb-6">
                    <div className="w-full max-w-xs">
                        <Input
                            type="text"
                            name="search"
                            placeholder="Search messages..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
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
                        <TableSkeleton rows={6} columns={columns.length} />
                    ) : paginatedData?.length === 0 ? (
                        <EmptyState
                            message="Nothing to display here yet. "
                        />
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
                                    {paginatedData?.map((msg) => (
                                        <TableRow key={msg._id}>
                                            {columns.map((col) => (
                                                <TableCell key={col.key} className="px-5 py-4 text-start">
                                                    {
                                                        renderColumn(
                                                            msg,
                                                            selected,
                                                            toggleSelect,
                                                            toggleDropdown,
                                                            openDropdown,
                                                            handleView,
                                                            handleEdit,
                                                            handleDelete
                                                        )[col.key]
                                                    }
                                                </TableCell>

                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-6">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={(newPage) => setPage(newPage)}
                                />
                            </div>
                        </>
                    )}
                </div>

            </div>
            
            {/* View Modal */}
            <Modal
                isOpen={isModalOpen && modalType === 'view'}
                onClose={() => setIsModalOpen(false)}
                className="max-w-3xl mx-auto p-6 rounded-2xl"
            >
                {selectedFx && (
                    <div className="space-y-8">
                        {/* Title */}
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            FX Engine Details
                        </h2>

                        {/* Basic Details */}
                        <div className="grid grid-cols-3 gap-6 p-6 rounded-xl border border-gray-200 bg-gray-50 
                dark:bg-gray-800/50 dark:border-gray-700">

                            {[
                                ["Source Country", selectedFx.source_country],
                                ["Destination Country", selectedFx.destination_country],
                                ["Rate", selectedFx.rate],
                                ["Min Rate", selectedFx.min_rate],
                                ["Max Rate", selectedFx.max_rate],
                                ["Rate Step", selectedFx.rate_step],
                                ["Promo Rate", selectedFx.promo_rate],
                                ["Operation Type", selectedFx.operation_type],
                                ["FX Provider", selectedFx.fx_provider],
                                ["Status", selectedFx.status ? "Active" : "Inactive"],
                                ["Created At", new Date(selectedFx.createdAt).toLocaleString()],
                            ].map(([label, value]) => (
                                <div key={label} className="flex flex-col space-y-1">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {label}
                                    </span>
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                                        {value as string}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Volume Tiers */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                                Volume Tiers
                            </h3>
                            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-700/60 text-gray-900 dark:text-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold">Min</th>
                                            <th className="px-4 py-3 text-left font-semibold">Max</th>
                                            <th className="px-4 py-3 text-left font-semibold">Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedFx.volume?.map((v) => (
                                            <tr
                                                key={v._id}
                                                className="border-t border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                            >
                                                <td className="px-4 py-3">{v.min}</td>
                                                <td className="px-4 py-3">{v.max}</td>
                                                <td className="px-4 py-3">{v.rate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Fees */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                                FX Fees
                            </h3>
                            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-700/60 text-gray-900 dark:text-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold">Min</th>
                                            <th className="px-4 py-3 text-left font-semibold">Max</th>
                                            <th className="px-4 py-3 text-left font-semibold">Fees</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedFx.fx_fees?.map((f) => (
                                            <tr
                                                key={f._id}
                                                className="border-t border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                            >
                                                <td className="px-4 py-3">{f.min}</td>
                                                <td className="px-4 py-3">{f.max}</td>
                                                <td className="px-4 py-3">{f.fees}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isModalOpen && modalType === "delete"}
                onClose={() => setIsModalOpen(false)}
                className="max-w-md mx-auto p-8 rounded-2xl"
            >
                <div className="flex flex-col items-center text-center space-y-6">

                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
                        <svg
                            className="w-10 h-10 text-red-600 dark:text-red-400"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.6501 12.0001C3.6501 7.38852 7.38852 3.6501 12.0001 3.6501C16.6117 3.6501 20.3501 7.38852 20.3501 12.0001C20.3501 16.6117 16.6117 20.3501 12.0001 20.3501C7.38852 20.3501 3.6501 16.6117 3.6501 12.0001ZM12.0001 1.8501C6.39441 1.8501 1.8501 6.39441 1.8501 12.0001C1.8501 17.6058 6.39441 22.1501 12.0001 22.1501C17.6058 22.1501 22.1501 17.6058 22.1501 12.0001C22.1501 6.39441 17.6058 1.8501 12.0001 1.8501ZM10.9992 7.52517C10.9992 8.07746 11.4469 8.52517 11.9992 8.52517H12.0002C12.5525 8.52517 13.0002 8.07746 13.0002 7.52517C13.0002 6.97289 12.5525 6.52517 12.0002 6.52517H11.9992C11.4469 6.52517 10.9992 6.97289 10.9992 7.52517ZM12.0002 17.3715C11.586 17.3715 11.2502 17.0357 11.2502 16.6215V10.945C11.2502 10.5308 11.586 10.195 12.0002 10.195C12.4144 10.195 12.7502 10.5308 12.7502 10.945V16.6215C12.7502 17.0357 12.4144 17.3715 12.0002 17.3715Z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Confirm Deletion
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 max-w-sm">
                        Are you sure you want to delete this FX Engine? This action cannot be undone.
                    </p>

                    <div className="flex justify-center space-x-4 pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6"
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white px-6"
                            onClick={() => {
                                //   handleDelete(); // your delete function
                                setIsModalOpen(false);
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>


        </div>
    );

}


