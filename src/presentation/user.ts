import { formatDate } from "../utils/common";

export const userPresenter = (user: any): any => {
  return {
    id: user.id,
    firstName: user.firstName,
    secondName: user.secondName,
    lastName: user.lastName,
    phone: userPhonePresenter(user),
    email: userEmailPresenter(user),
    stripeKycVerified: user?.paymentModes?.length > 0 && user?.paymentModes?.some((eachPaymentMode: any) => eachPaymentMode?.type === 'KYC' && eachPaymentMode?.isVerified),
    fullName: [user.firstName, user.secondName, user.lastName].filter(Boolean).join(' '),
    age: user.age,
    isActive: user.isActive,
    createdAt: formatDate(user.createdAt),
    updatedAt: formatDate(user.updatedAt),
  };
};

export const userEmailPresenter = (user: any): any => {
  if (!user.emails) return null;
  return user.emails.find((eachEmail: any) => eachEmail?.isPrimary) ? user.emails.find((eachEmail: any) => eachEmail.isPrimary)?.email : user.emails[0]?.email;
};

export const userPhonePresenter = (user: any): any => {
  if (!user.phones) return null;
  return user.phones.find((eachPhone: any) => eachPhone?.isPrimary) ? user.phones.find((eachPhone: any) => eachPhone.isPrimary)?.phone : user.phones[0]?.phone;
};


