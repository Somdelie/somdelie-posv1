import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerForm({
  showCustomerForm,
  setShowCustomerForm,
}: {
  showCustomerForm: boolean;
  setShowCustomerForm: (value: boolean) => void;
}) {
  return (
    <Dialog open={showCustomerForm} onOpenChange={setShowCustomerForm}>
      <form>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Fill the form below to add a new customer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Full Name</Label>
              <Input id="name-1" name="name" defaultValue="Cautious Ndlovu" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" defaultValue="@somdeliedev.com" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue="+1234567890" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue="123 Main St, Cityville"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
