import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Loader from "../ui/loader/Loader";
import Radio from "../form/input/Radio";
import Label from "../form/Label";
import Select from "../form/Select";
import { getCountries } from "../../redux/app";
import { updateBankMethod, getSingleBankMethod } from "../../redux/bankMethod";
import Alert from "../ui/alert/Alert";
import { useParams } from "react-router-dom";




interface BankMethodFormData {
    name: string;
    transferTime: string;
    senderCountry: number;
    active: boolean
    bank_fees: BankFees[];
}

interface BankFees {
    min: number;
    max: number;
    fees: number;
}

interface Option {
    value: string | number;
    label: string;
    active?: boolean;
}


export default function UpdateBankMethodComponent() {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams();

    const [submitLoading, setSubmitLoading] = useState(false);

    const [alert, setAlert] = useState<{ variant: "success" | "error" | "warning" | "info"; title: string; message: string } | null>(null);

    const { singleBankMethod, loading } = useSelector((state: RootState) => state.bankMethod);

    useEffect(() => {
        if (!id) return;

        dispatch(getSingleBankMethod(id))
            .unwrap()
            .then(() => console.log("Bank method fetched"))
            .catch((err) => console.error("Error fetching bank method:", err));
    }, [id, dispatch]);

    const bankMethod = singleBankMethod;


    const [formData, setFormData] = useState<BankMethodFormData>({
        name: "",
        transferTime: "",
        senderCountry: 0,
        active: true,
        bank_fees: []
    });

    const { countries } = useSelector((state: RootState) => state.app);

    useEffect(() => {
        if (!countries) {
            dispatch(getCountries());
        }
    }, [dispatch, countries]);

    const formattedCountries: Option[] =
        countries?.map((item) => ({
            value: item.id,
            label: `${item.country} (${item.currencyCode})`,
            active: item.id === bankMethod?.senderCountry, // highlight active one
        })) || [];


    const [bankFees, setBankFees] = useState([
        { id: 1, min: "", max: "", fees: "" }
    ]);


    useEffect(() => {
        if (!bankMethod) return;

        // 1. Fill main fields
        setFormData({
            name: bankMethod?.name || "",
            transferTime: bankMethod?.transferTime || "",
            active: bankMethod?.active === true,
            senderCountry: bankMethod?.senderCountry
                ? Number(bankMethod.senderCountry)
                : 0,

            bank_fees: bankMethod?.bank_fees || [],
        });

        // 2. Bank Fees
        if (bankMethod?.bank_fees?.length > 0) {
            setBankFees(bankMethod?.bank_fees.map(item => ({
                id: Date.now() + Math.random(),
                min: String(item.min),
                max: String(item.max),
                fees: String(item.fees),
            })));
        }
    }, [bankMethod]);


    const handleInputChange = (field: keyof BankMethodFormData, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addBankFee = () => {
        setBankFees(prev => [...prev, { id: Date.now(), min: "", max: "", fees: "" }]);
    };

    const removeBankFee = (id: number) => {
        if (bankFees.length > 1) {
            setBankFees(prev => prev.filter(item => item.id !== id));
        }
    };

    const updateBankFee = (id: number, field: keyof BankFees, value: string) => {
        setBankFees(prev =>
            prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
        );
    };


    const handleSubmit = async () => {
        setAlert(null); // clear old alerts
        setSubmitLoading(true);

        const data = {
            ...formData,
            bank_fees: bankFees.map(fee => ({
                min: Number(fee.min),
                max: Number(fee.max),
                fees: Number(fee.fees)
            }))
        };

        try {
            const res = await dispatch(updateBankMethod({ id: bankMethod!._id, data })).unwrap();
            if (res.data?.name) {
                setAlert({
                    variant: "success",
                    title: "Bank Method Created",
                    message: (res as { message?: string })?.message || "Bank Method updated successfully.",
                });
            } else {
                setAlert({
                    variant: "error",
                    title: "Creation Failed",
                    message: (res as { message?: string })?.message || "Failed to create Bank Method",
                });
            }

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Something went wrong while saving.";
            setAlert({
                variant: "error",
                title: "Submission Failed",
                message: errorMessage,
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: "",
            transferTime: "",
            senderCountry: 0,
            active: true,
            bank_fees: []
        });
        setBankFees([{ id: 1, min: "", max: "", fees: "" }]);
    };


    return (
        <div>
            <PageMeta title="Stazhin Bank Method" description="" />
            <PageBreadcrumb pageTitle="Bank Method" />
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                {alert && (
                    <Alert
                        variant={alert.variant}
                        title={alert.title}
                        message={alert.message}
                    />
                )}
                {loading || submitLoading && (
                    <div className="mb-4">
                        <Loader />
                    </div>
                )}
                <div className="rounded-2xl">
                    <div className="space-y-6">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                        </div>

                        <div >
                            <Label>Transfer Time</Label>
                            <Input
                                value={formData.transferTime}
                                onChange={(e) => handleInputChange("transferTime", e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Sender Country</Label>
                            <Select
                                options={formattedCountries}
                                placeholder="Select Sender Country"
                                onChange={(value) => handleInputChange("senderCountry", value)}
                                defaultValue={formData.senderCountry}
                            />
                        </div>

                        <div>
                            <Label>Status</Label>
                            <div className="flex gap-6">
                                <Radio
                                    id="active"
                                    name="active"
                                    value="true"
                                    checked={formData.active === true}
                                    label="Active"
                                    onChange={() => handleInputChange("active", true)}
                                />
                                <Radio
                                    id="inactive"
                                    name="active"
                                    value="false"
                                    checked={formData.active === false}
                                    label="Inactive"
                                    onChange={() => handleInputChange("active", false)}
                                />
                            </div>
                        </div>

                        {/* Bank Fees */}
                        <div>
                            <Label>Bank Fees</Label>
                            <div className="space-y-3">
                                {bankFees.map((fee) => (
                                    <div key={fee.id} className="flex gap-3">
                                        <Input
                                            placeholder="Min"
                                            type="number"
                                            value={fee.min}
                                            onChange={(e) => updateBankFee(fee.id, "min", e.target.value)}
                                            className="flex-1"
                                        />
                                        <Input
                                            placeholder="Max"
                                            type="number"
                                            value={fee.max}
                                            onChange={(e) => updateBankFee(fee.id, "max", e.target.value)}
                                            className="flex-1"
                                        />
                                        <Input
                                            placeholder="Fees"
                                            type="number"
                                            value={fee.fees}
                                            onChange={(e) => updateBankFee(fee.id, "fees", e.target.value)}
                                            className="flex-1"
                                        />
                                        <button
                                            onClick={() => removeBankFee(fee.id)}
                                            className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" onClick={addBankFee} className="mt-3">
                                + Add Fees
                            </Button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button variant="primary" onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button variant="outline" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )


}