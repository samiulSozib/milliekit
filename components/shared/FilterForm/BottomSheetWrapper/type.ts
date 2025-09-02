export type BottomSheetWrapperPropsType = {
  isOpen: boolean;
  adultPassengerCount: number;
  childPassengerCount: number;

  onClose(): void;
  onAdultPassengersChange(count: number): void;
  onChildPassengersChange(count: number): void;
  onApplyPassengers(): void;
};