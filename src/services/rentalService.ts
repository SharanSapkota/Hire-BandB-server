import * as rentRepo from '../repositories/rentalRepository';

export function listRentals() {
  return rentRepo.findAllRentals();
}

export function getRental(id: number) {
  return rentRepo.findRentalById(id);
}

export function createRental(data: any) {
  return rentRepo.createRental(data);
}

export function updateRental(id: number, data: any) {
  return rentRepo.updateRental(id, data);
}

export function deleteRental(id: number) {
  return rentRepo.deleteRental(id);
}
