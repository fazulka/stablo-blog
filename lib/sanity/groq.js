import { groq } from "next-sanity";

// ─── Settings ──────────────────────────────────────────────────────────────
export const settingsQuery = groq`
*[_type == "settings"][0] {
  ...,
  "logo": logo.asset->,
  "logoLight": logoLight.asset->,
  "openGraphImage": openGraphImage.asset->
}
`;

// ─── Workshops ─────────────────────────────────────────────────────────────
const workshopCardProjection = groq`
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  difficulty,
  ageGroup,
  duration,
  featured,
  mainImage {
    ...,
    "alt": alt,
    "lqip": asset->metadata.lqip
  },
  category->{ _id, title, "slug": slug.current, color, icon }
`;

export const allWorkshopsQuery = groq`
*[_type == "workshop"] | order(featured desc, title asc) {
  ${workshopCardProjection}
}
`;

export const featuredWorkshopsQuery = groq`
*[_type == "workshop" && featured == true] | order(title asc) {
  ${workshopCardProjection}
}
`;

export const workshopBySlugQuery = groq`
*[_type == "workshop" && slug.current == $slug][0] {
  ...,
  "slug": slug.current,
  mainImage {
    ...,
    "alt": alt,
    "lqip": asset->metadata.lqip
  },
  gallery[] {
    ...,
    "alt": alt,
    "lqip": asset->metadata.lqip
  },
  category->{ _id, title, "slug": slug.current, color, icon },
  instructor->{ _id, name, "slug": slug.current, photo, shortBio },
  "upcomingSessions": *[
    _type == "session"
    && references(^._id)
    && status in ["open", "sold_out"]
    && dates[0].start > now()
  ] | order(dates[0].start asc) {
    _id,
    dates,
    price,
    capacity,
    status,
    "location": location->{ _id, name, address, city, mapUrl },
    "bookedSeats": count(*[
      _type == "booking"
      && references(^._id)
      && status == "paid"
    ].numberOfSeats)
  }
}
`;

export const workshopSlugsQuery = groq`
*[_type == "workshop" && defined(slug.current)][].slug.current
`;

// ─── Sessions ──────────────────────────────────────────────────────────────
export const upcomingSessionsQuery = groq`
*[
  _type == "session"
  && status in ["open", "sold_out"]
  && dates[0].start > now()
] | order(dates[0].start asc) [0...$limit] {
  _id,
  dates,
  price,
  capacity,
  status,
  workshop->{
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    duration,
    difficulty,
    ageGroup,
    mainImage {
      ...,
      "alt": alt,
      "lqip": asset->metadata.lqip
    },
    category->{ _id, title, "slug": slug.current, color, icon }
  },
  "location": location->{ _id, name, address, city, mapUrl },
  "bookedSeats": count(*[
    _type == "booking"
    && references(^._id)
    && status == "paid"
  ].numberOfSeats)
}
`;

export const sessionByIdQuery = groq`
*[_type == "session" && _id == $id][0] {
  _id,
  dates,
  price,
  capacity,
  status,
  notes,
  workshop->{
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    duration,
    mainImage {
      ...,
      "alt": alt
    },
    category->{ _id, title, color, icon }
  },
  location->{ _id, name, address, city, mapUrl, directions },
  "bookedSeats": count(*[
    _type == "booking"
    && references(^._id)
    && status == "paid"
  ].numberOfSeats)
}
`;

// ─── Bookings ──────────────────────────────────────────────────────────────
export const bookingByIdQuery = groq`
*[_type == "booking" && _id == $id][0] {
  _id,
  _createdAt,
  customerName,
  customerEmail,
  customerPhone,
  numberOfSeats,
  paymentMethod,
  status,
  totalAmount,
  variableSymbol,
  paidAt,
  message,
  confirmationEmailSent,
  session->{
    _id,
    dates,
    price,
    "workshop": workshop->{
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      duration,
      mainImage {
        ...,
        "alt": alt
      }
    },
    "location": location->{ _id, name, address, city, mapUrl }
  }
}
`;

// ─── Categories ────────────────────────────────────────────────────────────
export const allCategoriesQuery = groq`
*[_type == "category"] | order(order asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  icon,
  color,
  image,
  "workshopCount": count(*[_type == "workshop" && references(^._id)])
}
`;
