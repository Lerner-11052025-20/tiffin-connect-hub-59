import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="bg-card shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-border">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="font-heading font-black text-3xl mb-2 text-foreground">Payment Cancelled</h1>
                <p className="text-muted-foreground mb-8">
                    You can retry the payment from your order page anytime. Your cart is preserved.
                </p>
                <Button onClick={() => navigate("/dashboard/meals")} className="w-full">
                    Browse Meals Again
                </Button>
            </div>
        </div>
    );
}
