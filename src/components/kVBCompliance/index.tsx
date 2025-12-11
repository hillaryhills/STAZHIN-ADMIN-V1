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
import { columns, renderColumn, ICompliance } from "../../redux/kVBCompliance/interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import Input from "../form/input/InputField";
import Pagination from "../ui/pagination";
import TableSkeleton from "../ui/skeleton/TableSkeleton";
import EmptyState from "../ui/empty/EmptyState";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { Link } from 'react-router-dom';
import { PlusIcon } from "../../icons";
import { getAllComplianceRecord, deleteComplianceRecord } from "../../redux/kVBCompliance";



export default function ComplianceComponent() {
    const dispatch = useDispatch<AppDispatch>();
    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<string | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<ICompliance | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (id: string | null) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };


    const handleView = (item: ICompliance) => {
        setIsModalOpen(true);
        setSelectedRecord(item);
        setModalType('view');
        setOpenDropdown(null);
    };


    const handleDelete = (id: string) => {
        if (!id) return;

        if (!window.confirm("Are you sure you want to delete this item?")) return;

        dispatch(deleteComplianceRecord(id))
            .unwrap()
            .then(() => {
                setSelectedRecord(null);
                setIsModalOpen(false);
                dispatch(getAllComplianceRecord());
            })
            .catch((error) => {
                console.error("Failed to delete record:", error);
            });
    };

    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };


    const { complianceRecords, loading } = useSelector(
        (state: RootState) => state.compliance
    );


    // Load initial messages
    useEffect(() => {
        if (complianceRecords === null) {
            dispatch(getAllComplianceRecord());
        }
    }, [dispatch, complianceRecords]);

    // Search (debounced)
    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(getAllComplianceRecord());
        }, 500);
        return () => clearTimeout(timeout);
    }, [dispatch, search]);

    const filteredData = complianceRecords?.filter((item) => {
        const term = search.toLowerCase();

        // Check accountType
        const accountTypeMatch = item.accountType.toLowerCase().includes(term);

        // Check fund/currency arrays
        const fundInCountriesMatch = item.complianceInfo.fundInCountries.some(c =>
            c.toLowerCase().includes(term)
        );
        const fundInCcysMatch = item.complianceInfo.fundInCcys.some(c =>
            c.toLowerCase().includes(term)
        );
        const fundOutCountriesMatch = item.complianceInfo.fundOutCountries.some(c =>
            c.toLowerCase().includes(term)
        );
        const fundOutCcysMatch = item.complianceInfo.fundOutCcys.some(c =>
            c.toLowerCase().includes(term)
        );

        return accountTypeMatch || fundInCountriesMatch || fundInCcysMatch || fundOutCountriesMatch || fundOutCcysMatch;
    });


    // Pagination logic
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData?.slice(startIndex, startIndex + limit);

    // Total pages
    const totalPages = Math.ceil((filteredData?.length || 0) / limit);


    return (
        <div>
            <PageMeta title="KVB Complaince" description="" />
            <PageBreadcrumb pageTitle="KVB Complaince" />
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <Button size="sm" className="mb-4" startIcon={<PlusIcon />} variant="primary">
                    <Link to="/compliance/add" className="text-white">Add New</Link>
                </Button>
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
                {/* TABLE */}
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
                {selectedRecord && (
                    <div className="space-y-8">
                        {/* Title */}
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Compliance Details
                        </h2>

                        {/* Basic Details */}
                        <div className="grid grid-cols-2 gap-6 p-6 rounded-xl border border-gray-200 bg-gray-50 
            dark:bg-gray-800/50 dark:border-gray-700">
                            {[
                                ["Account Type", selectedRecord.accountType],
                                ["Created At", new Date(selectedRecord.createdAt).toLocaleString()],
                                ["Updated At", new Date(selectedRecord.updatedAt).toLocaleString()],
                            ].map(([label, value]) => (
                                <div key={label} className="flex flex-col space-y-1">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {label}
                                    </span>
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Compliance Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                                Compliance Information
                            </h3>
                            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-4">
                                {[
                                    ["Account Purpose", selectedRecord.complianceInfo.accountPurpose.join(", ")],
                                    ["Fund In Countries", selectedRecord.complianceInfo.fundInCountries.join(", ")],
                                    ["Fund In Currencies", selectedRecord.complianceInfo.fundInCcys.join(", ")],
                                    ["Expected Fund In Volume", selectedRecord.complianceInfo.expectedFundInVolPerMonth],
                                    ["Fund Out Countries", selectedRecord.complianceInfo.fundOutCountries.join(", ")],
                                    ["Fund Out Currencies", selectedRecord.complianceInfo.fundOutCcys.join(", ")],
                                    ["Expected Fund Out Volume", selectedRecord.complianceInfo.expectedFundOutVolPerMonth],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex flex-col space-y-1">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {label}
                                        </span>
                                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    )


}