import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  getReserveMessages,
  sendReserveMessage,
} from "../../../services/reserveService";

// Child components
import ReserveDetailsPanel  from "./ReserveDetailsPanel";
import MessagesPreview      from "./MessagesPreview";
import InvoiceDetails       from "./InvoiceDetails";
import AddCommentSection    from "./AddCommentSection";
import UpdateOptionsButtons from "./UpdateOptionsButtons";
import CommentSection       from "./CommentSection";
import PaymentSimulator from "@/components/payment/PaymentSimulator";
import PaymentStatusBadge from "@/components/payment/PaymentStatusBadge";
import ReservationTimeline from "@/components/payment/ReservationTimeline";

const getMessageList = (response) => {
  const payload = response?.data ?? response;
  return Array.isArray(payload) ? payload : [];
};

export default function ReserveInformation({ reserve, onBack, onUpdateSuccess }) {
  const [messages, setMessages]            = useState([]);
  const [loadingChat, setLoadingChat]      = useState(false);
  const [chatError, setChatError]          = useState(null);
  const [newMessage, setNewMessage]        = useState("");
  const [sendingMessage, setSendingMessage]= useState(false);
  const [comment, setComment]              = useState(reserve.comment || null);
  const [payment, setPayment]              = useState(reserve.payment || null);
  const [isPaymentOpen, setIsPaymentOpen]  = useState(false);

  useEffect(() => {
    setPayment(reserve.payment || null);
  }, [reserve.payment, reserve.uuid]);

  useEffect(() => {
    if (!reserve?.uuid) return;
    const fetchMessages = async () => {
      try {
        setLoadingChat(true);
        setChatError(null);
        const response = await getReserveMessages(reserve.uuid);
        setMessages(getMessageList(response));
      } catch (error) {
        setChatError(
          error?.response?.data?.message ||
            error.message ||
            "خطایی رخ داده است"
        );
      } finally {
        setLoadingChat(false);
      }
    };
    fetchMessages();
  }, [reserve?.uuid]);

  if (!reserve) return <p>هیچ اطلاعاتی وجود ندارد</p>;

  const handleSendMessage = async ({ attachment, attachmentKind } = {}) => {
    const messageText = newMessage.trim();
    if (!messageText && !attachment) return false;

    const payload = attachment ? new FormData() : messageText;
    if (attachment) {
      payload.append("message", messageText);
      payload.append("attachment", attachment);
      payload.append("attachment_kind", attachmentKind || "");
    }

    try {
      setSendingMessage(true);
      await sendReserveMessage(reserve.uuid, payload);
      toast.success("پیام با موفقیت ارسال شد");
      const updated = await getReserveMessages(reserve.uuid);
      setMessages(getMessageList(updated));
      setNewMessage("");
      return true;
    } catch (error) {
      setChatError(
        error?.response?.data?.message || error.message || "خطایی رخ داده است"
      );
      return false;
    } finally {
      setSendingMessage(false);
    }
  };

  const currentReserve  = payment ? { ...reserve, payment, payment_status: payment.status } : reserve;
  const invoice         = currentReserve.invoice || {};
  const payLink         = invoice.links?.pay || null;
  const canSendComment  = currentReserve.comment?.can_send_comment;
  const canSendChat     = (currentReserve.can_update_to?.length ?? 0) > 0;
  const paymentKey      = currentReserve.payment_status?.key || currentReserve.payment?.status?.key;
  const canPaySandbox   =
    invoice.links?.pay_available ||
    ["created", "failed", "pending"].includes(paymentKey);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-2 items-center truncate">
          <p className="font-bold">شماره رزرو:</p>
          <span className="rounded-3xl px-2 bg-primary-50 pt-1">
            {currentReserve.uuid || "بدون شماره"}
          </span>
        </div>
        <PaymentStatusBadge status={currentReserve.payment_status || currentReserve.payment?.status} />
        <button
          onClick={onBack}
          className="px-3 py-2 text-secondary-50 bg-primary-500 rounded-3xl hover:bg-primary-600 text-sm"
        >
          بازگشت
        </button>
      </div>

      {/* Status buttons + پرداخت نهایی */}
      <UpdateOptionsButtons
        options={currentReserve.can_update_to}
        reserveUuid={currentReserve.uuid}
        payLink={payLink}
        onUpdateSuccess={onUpdateSuccess}
      />

      {canPaySandbox && (
        <button
          type="button"
          data-testid="reservation-payment-trigger"
          onClick={() => setIsPaymentOpen(true)}
          className="btn-press rounded-2xl bg-primary-action px-4 py-2 text-sm text-primary-contrast hover:bg-primary-action-hover"
        >
          {paymentKey === "failed" ? "تلاش دوباره پرداخت آزمایشی" : "ادامه پرداخت آزمایشی"}
        </button>
      )}

      <ReservationTimeline reservation={currentReserve} />

      {/* Details + message preview */}
      <div className="flex flex-col gap-4 xl:flex-row-reverse xl:items-stretch">
        <section className="-mx-4 flex h-[76dvh] max-h-[76dvh] min-h-0 w-auto sm:mx-0 sm:w-full md:h-[68dvh] md:max-h-[68dvh] xl:h-[66dvh] xl:max-h-[66dvh] xl:w-1/2">
          <MessagesPreview
            messages={messages}
            loading={loadingChat}
            chatError={chatError}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
            sendingMessage={sendingMessage}
            allowSendMessage={canSendChat}
            limit={10}
            messagesAreaClassName="min-h-0 flex-1"
          />
        </section>

        <section className="flex w-full flex-col gap-4 xl:w-1/2">
          <ReserveDetailsPanel reserve={currentReserve} />
          <InvoiceDetails invoice={invoice} />
          {canSendComment ? (
            <AddCommentSection
              reserveUuid={currentReserve.uuid}
              onCommentSent={(c) => {
                setComment(c);
                onUpdateSuccess?.();
              }}
            />
          ) : (
            <CommentSection comment={comment} />
          )}
        </section>
      </div>

      <PaymentSimulator
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        reservation={currentReserve}
        onCompleted={(nextPayment) => {
          setPayment(nextPayment);
          onUpdateSuccess?.();
        }}
      />
    </div>
  );
}
