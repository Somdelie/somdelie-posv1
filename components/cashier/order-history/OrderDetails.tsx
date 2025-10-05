import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";

interface OrderDetailsProps {
  orderData: {
    orderNumber: string;
    createdAt: string;
    status: string;
    customer: {
      fullName: string;
      email: string;
      phone: string;
    };
    items: {
      name: string;
      quantity: number;
      price: number;
      totalAmount: number;
    }[];
    subtotal: number;
    tax: number;
    discount: number;
    totalAmount: number;
    paymentType: string;
  };
}

const OrderDetails = ({ orderData }: OrderDetailsProps) => {
  // Sample order details - replace with actual data

  return (
    <div className="space-y-4">
      {/* Order Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{orderData.orderNumber}</h3>
          <p className="text-sm text-muted-foreground">{orderData.createdAt}</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {orderData.status}
        </Badge>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-medium">Name: </span>
            {orderData?.customer?.fullName}
          </div>
          <div>
            <span className="font-medium">Email: </span>
            {orderData?.customer?.email}
          </div>
          <div>
            <span className="font-medium">Phone: </span>
            {orderData?.customer?.phone}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orderData?.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <div className="font-medium">
                  {formatPrice(item.totalAmount)}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(orderData.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{formatPrice(orderData.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-{formatPrice(orderData.discount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatPrice(orderData.totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="font-medium">{orderData.paymentType}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
