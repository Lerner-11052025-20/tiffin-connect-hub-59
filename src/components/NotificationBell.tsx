import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import socket from "@/lib/socket";
import { useAuth } from "@/hooks/useAuth";
import {
    Bell,
    Trash2,
    Clock,
    ChevronRight,
    Truck,
    CheckCircle2,
    XCircle,
    ChefHat,
    PackagePlus,
    AlertTriangle
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import api from "@/lib/api";
import { formatDistanceToNow, isValid } from "date-fns";

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: string;
    role?: 'admin' | 'vendor' | 'user';
    orderId?: string;
    vendorId?: string;
    eta?: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export function NotificationBell() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    const { data: notificationsData } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => api.get<NotificationItem[]>("/notifications"),
        staleTime: 0,
    });

    const notifications: NotificationItem[] = Array.isArray(notificationsData) ? notificationsData : [];
    const unreadCount = notifications.filter((n: NotificationItem) => !n.isRead).length;

    useEffect(() => {
        if (!user) return;

        // Establish socket connection
        socket.connect();
        
        // Join personal room
        socket.emit('join', user.user_id || user.id);

        // Listen for real-time notifications
        const handleNewNotification = (notif: NotificationItem) => {
            console.log("🔔 Real-time notification received:", notif);
            
            // Invalidate query to get fresh list
            queryClient.invalidateQueries({ queryKey: ["notifications"] });

            // Show global toast
            toast.info(notif.title, {
                description: notif.message,
                icon: <Bell className="h-4 w-4" />,
            });
        };

        socket.on('notification', handleNewNotification);

        return () => {
            socket.off('notification', handleNewNotification);
            socket.disconnect();
        };
    }, [user, queryClient]);

    const markAllRead = useMutation({
        mutationFn: () => api.put("/notifications/read-all", {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("Marked as read");
        },
    });

    const markReadAction = useMutation({
        mutationFn: (id: string) => api.put(`/notifications/${id}/read`, {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const clearAll = useMutation({
        mutationFn: () => api.delete('/notifications'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("All notifications cleared");
        }
    });

    const handleNotificationClick = (n: NotificationItem) => {
        if (!n.isRead) markReadAction.mutate(n.id);
        if (n.link) {
            setOpen(false);
            navigate(n.link);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
            case 'preparing': return <ChefHat className="h-4 w-4 text-blue-500" />;
            case 'out_for_delivery': return <Truck className="h-4 w-4 text-purple-500" />;
            case 'delivered': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
            case 'new_order': return <PackagePlus className="h-4 w-4 text-emerald-500" />;
            case 'admin': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            case 'system': return <Bell className="h-4 w-4 text-muted-foreground" />;
            default: return <Bell className="h-4 w-4 text-primary" />;
        }
    };

    const formatTimestamp = (dateStr: string) => {
        const date = new Date(dateStr);
        if (!isValid(date)) return 'just now';
        return formatDistanceToNow(date, { addSuffix: true });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-muted/50 transition-all border border-transparent hover:border-border group">
                    <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white w-[18px] h-[18px] border-2 border-background shadow-sm">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[420px] p-0 mt-3 rounded-[2rem] shadow-2xl overflow-hidden border-border/40 z-50 bg-background/95 backdrop-blur-xl" align="end">
                <div className="flex items-center justify-between p-6 bg-muted/20 border-b border-border/40">
                    <div>
                        <h4 className="font-heading font-black text-xs uppercase tracking-[0.2em] text-foreground">Notifications</h4>
                        <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">{unreadCount} Unread Message{unreadCount !== 1 ? 's' : ''}</p>
                    </div>
                    {unreadCount > 0 && (
                        <Button onClick={() => markAllRead.mutate()} variant="ghost" size="sm" className="h-auto p-0 text-[10px] text-primary font-black uppercase tracking-[0.1em] hover:bg-transparent hover:text-primary/80">
                            Clear all
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[420px] w-full">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground min-h-[400px]">
                            <div className="w-20 h-20 rounded-full bg-muted/40 flex items-center justify-center mb-6 border border-border/40">
                                <Bell className="h-8 w-8 opacity-20 text-muted-foreground" />
                            </div>
                            <h3 className="font-heading font-black text-lg text-foreground mb-1 uppercase tracking-tight">Stay Updated</h3>
                            <p className="font-medium text-[11px] text-muted-foreground/60 max-w-[220px] mx-auto leading-relaxed">Notifications regarding your orders and platform activity will appear here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/20">
                            {notifications.map((n: NotificationItem) => (
                                <button
                                    key={n.id}
                                    className={`w-full p-6 text-left flex gap-5 hover:bg-muted/40 transition-all border-l-4 ${!n.isRead ? "bg-primary/5 border-primary" : "border-transparent"}`}
                                    onClick={() => handleNotificationClick(n)}
                                >
                                    <div className={`mt-0.5 w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-border/40 ${!n.isRead ? "bg-primary/10 shadow-sm" : "bg-muted/30"}`}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex justify-between items-start gap-3">
                                            <p className={`text-[13px] truncate leading-tight tracking-tight uppercase ${!n.isRead ? "font-black text-foreground" : "font-bold text-foreground/60"}`}>
                                                {n.title}
                                            </p>
                                            <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/50 whitespace-nowrap pt-0.5">
                                                {formatTimestamp(n.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-muted-foreground/80 font-medium leading-[1.6] line-clamp-2">{n.message}</p>

                                        {n.link && (
                                            <div className="flex items-center gap-1.5 pt-2 group/link">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest group-hover/link:underline">View details</span>
                                                <ChevronRight className="h-3 w-3 text-primary transition-transform group-hover/link:translate-x-0.5" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <div className="p-4 border-t border-border/40 bg-zinc-50 dark:bg-zinc-950/40">
                        <Button
                            onClick={() => clearAll.mutate()}
                            variant="ghost"
                            size="sm"
                            className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-red-500 hover:bg-red-500/5 rounded-2xl h-11"
                        >
                            <Trash2 className="h-4 w-4 mr-2" /> Clear All History
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
