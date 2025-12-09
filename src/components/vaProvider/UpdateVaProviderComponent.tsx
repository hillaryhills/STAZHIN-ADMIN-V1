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
import Alert from "../ui/alert/Alert";
import { updateVaProvider, getSingleFxProvider } from "../../redux/vaProvider";
import { useParams } from "react-router-dom";


interface Currencies {
    _id?: string;
    name: string;
    description?: string;
}

interface VaProviderFormData {
    provider_name: string;
    currency: Currencies[];
    wallet_type: string;
    virtual_wallet: string;
    fx_type: string;
}

export default function UpdateVaProviderComponent() {
    const dispatch = useDispatch<AppDispatch>();

    const { id } = useParams();

    const [submitLoading, setSubmitLoading] = useState(false);

    const { singleVaProvider, loading } = useSelector((state: RootState) => state.vaProvider);

    const [alert, setAlert] = useState<{
        variant: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
    } | null>(null);


    useEffect(() => {
        if (!id) return;

        dispatch(getSingleFxProvider(id))
            .unwrap()
            .then(() => console.log("Bank method fetched"))
            .catch((err) => console.error("Error fetching bank method:", err));
    }, [id, dispatch]);

    const fxProvider = singleVaProvider;


    const [formData, setFormData] = useState<VaProviderFormData>({
        provider_name: "",
        currency: [],
        wallet_type: "",
        virtual_wallet: "",
        fx_type: "",
    });

    const [currencies, setCurrencies] = useState<Currencies[]>([]);

    const handleInputChange = (field: keyof VaProviderFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addCurrency = () => {
        setCurrencies((prev) => [...prev, { name: "", description: "" }]);
    };

    const removeCurrency = (index: number) => {
        setCurrencies((prev) => prev.filter((_, i) => i !== index));
    };

    const updateCurrency = (
        index: number,
        field: keyof Currencies,
        value: string
    ) => {
        setCurrencies((prev) =>
            prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
        );
    };

    useEffect(() => {
        if (!fxProvider) return;

        // 1. Fill main fields
        setFormData({
            provider_name: fxProvider?.provider_name || "",
            wallet_type: fxProvider?.wallet_type || "",
            virtual_wallet: fxProvider?.virtual_wallet || "",
            fx_type: fxProvider?.fx_type || "",
            currency: [],
        });

        // 2. Currency
        if (fxProvider?.currency?.length > 0) {
            setCurrencies(
                fxProvider.currency.map((item) => ({
                    name: String(item.name),
                    description: "description" in item ? String(item.description) : "",
                }))
            );
        }

    }, [fxProvider]);

    const handleSubmit = async () => {
        setAlert(null);
        setSubmitLoading(true);

        const data = {
            ...formData,
            currency: currencies,
        };
        try {
            const res = await dispatch(
                updateVaProvider({ id: fxProvider!._id, data })
            ).unwrap() as { status?: boolean; data?: { name?: string }; message?: string };

            if (res?.status) {
                setAlert({
                    variant: "success",
                    title: "Creation Successful",
                    message: res?.message || "",
                });
            } else {
                setAlert({
                    variant: "error",
                    title: "Creation Failed",
                    message: res?.message || "Failed to create provider.",
                });
            }
        } catch (err: unknown) {
            setAlert({
                variant: "error",
                title: "Submission Failed",
                message:
                    err instanceof Error
                        ? err.message
                        : "Something went wrong while saving.",
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleReset = () => {
        if (!fxProvider) return;

        // 1. Fill main fields
        setFormData({
            provider_name: fxProvider?.provider_name || "",
            wallet_type: fxProvider?.wallet_type || "",
            virtual_wallet: fxProvider?.virtual_wallet || "",
            fx_type: fxProvider?.fx_type || "",
            currency: [],
        });

        // 2. Currency
        if (fxProvider?.currency?.length > 0) {
            setCurrencies(
                fxProvider.currency.map((item) => ({
                    name: String(item.name),
                    description: "description" in item ? String(item.description) : "",
                }))
            );
        }

    };

    return (
        <div>
            <PageMeta title="Stazhin FX Providers" description="" />
            <PageBreadcrumb pageTitle="FX Providers" />

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

                <div className="space-y-6">
                    {/* Provider Name */}
                    <div>
                        <Label>Provider Name</Label>
                        <Input
                            value={formData.provider_name}
                            onChange={(e) =>
                                handleInputChange("provider_name", e.target.value)
                            }
                        />
                    </div>

                    {/* Radio Groups */}
                    <div className="space-y-6">
                        {/* FX TYPE */}
                        <div>
                            <Label>Fx Type</Label>
                            <div className="flex gap-6 mt-2">
                                <Radio
                                    id="fx_forward_trade"
                                    name="fx_type"
                                    checked={formData.fx_type === "forward_trade"}
                                    label="Forward Trade"
                                    onChange={() =>
                                        handleInputChange("fx_type", "forward_trade")
                                    }
                                    value=""
                                />
                                <Radio
                                    id="fx_spot_fx"
                                    name="fx_type"
                                    checked={formData.fx_type === "spot_fx"}
                                    label="Spot FX"
                                    onChange={() =>
                                        handleInputChange("fx_type", "spot_fx")
                                    }
                                    value=""
                                />
                            </div>
                        </div>

                        {/* VIRTUAL WALLET */}
                        <div>
                            <Label>Virtual Wallet</Label>
                            <div className="flex gap-6 mt-2">
                                <Radio
                                    id="virtual_wallet_active"
                                    name="virtual_wallet"
                                    checked={formData.virtual_wallet === "active"}
                                    label="Active"
                                    onChange={() =>
                                        handleInputChange("virtual_wallet", "active")
                                    }
                                    value=""

                                />
                                <Radio
                                    id="virtual_wallet_inactive"
                                    name="virtual_wallet"
                                    checked={formData.virtual_wallet === "inactive"}
                                    label="Inactive"
                                    onChange={() =>
                                        handleInputChange("virtual_wallet", "inactive")
                                    }
                                    value=""

                                />
                            </div>
                        </div>

                        {/* WALLET TYPE */}
                        <div>
                            <Label>Wallet Type</Label>
                            <div className="flex gap-6 mt-2">
                                <Radio
                                    id="wallet_type_fiat"
                                    name="wallet_type"
                                    checked={formData.wallet_type === "fiat"}
                                    label="Fiat"
                                    onChange={() =>
                                        handleInputChange("wallet_type", "fiat")
                                    }
                                    value=""

                                />
                                <Radio
                                    id="wallet_type_crypto"
                                    name="wallet_type"
                                    checked={formData.wallet_type === "crypto"}
                                    label="Crypto"
                                    onChange={() =>
                                        handleInputChange("wallet_type", "crypto")
                                    }
                                    value=""
                                />
                            </div>
                        </div>
                    </div>

                    {/* Currency Section */}
                    <div>
                        <Label>Currency</Label>

                        <div className="space-y-3">
                            {currencies.map((currency, index) => (
                                <div key={index} className="flex gap-3">
                                    <Input
                                        placeholder="Currency Name"
                                        value={currency.name}
                                        onChange={(e) =>
                                            updateCurrency(index, "name", e.target.value)
                                        }
                                        className="flex-1"
                                    />
                                    <Input
                                        placeholder="Description"
                                        value={currency.description}
                                        onChange={(e) =>
                                            updateCurrency(
                                                index,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className="flex-1"
                                    />
                                    <button
                                        onClick={() => removeCurrency(index)}
                                        className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" onClick={addCurrency} className="mt-3">
                            + Add Currency
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
    );
}
