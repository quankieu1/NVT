export interface CropConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PhotoItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  crop?: CropConfig;
}

export interface PersonInfo {
  fullName: string;
  shortName: string;
  photo: PhotoItem;
  bio?: string;
}

export interface FamilySide {
  fatherName: string;
  motherName: string;
  address?: string;
}

export interface WeddingEvent {
  id: string;
  kind: "ceremony" | "bride_party" | "groom_party";
  sectionNumber?: string;
  englishSubtitle: string;
  title: string;
  subtitle?: string;
  /** ISO 8601 string theo giờ Việt Nam (+07:00) */
  startAt: string;
  lunarLabel: string;
  venueName: string;
  address: string;
  mapUrl: string;
  mapLat: number;
  mapLng: number;
}

export interface GiftItem {
  side: "groom" | "bride";
  title: string;
  englishLabel: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  qrImage: PhotoItem;
}

export interface GuestbookEntry {
  id: string;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface WeddingConfig {
  seo: {
    title: string;
    description: string;
    siteName: string;
    ogImage: string;
  };
  couple: {
    groom: PersonInfo;
    bride: PersonInfo;
    brideFirst: boolean;
  };
  families: {
    groom: FamilySide;
    bride: FamilySide;
    brideFamilyFirst: boolean;
  };
  coverPhoto: PhotoItem;
  events: {
    ceremony: WeddingEvent;
    brideParty: WeddingEvent;
    groomParty: WeddingEvent;
  };
  countdownEventId: "ceremony" | "brideParty" | "groomParty";
  album: PhotoItem[];
  gifts: GiftItem[];
  music: {
    src: string;
    autoplay: boolean;
  };
  labels: {
    coverEyebrow: string;
    coverInviteUpper: string;
    coverInviteLower: string;
    openButton: string;
    coupleSection: { index: string; en: string; vi: string };
    familySection: { index: string; en: string; vi: string; groomSide: string; brideSide: string };
    invitationIntro: { line1: string; line2: string; ceremonyPrefix: string; atTimePrefix: string };
    albumSection: { index: string; en: string; vi: string };
    guestbookSection: {
      index: string;
      en: string;
      vi: string;
      subtitle: string;
      formTitle: string;
    };
    giftSection: {
      index: string;
      en: string;
      vi: string;
      buttonLabel: string;
      note: string;
      modalSubtitle: string;
    };
    countdownSection: {
      index: string;
      en: string;
      vi: string;
      todayMessage: string;
    };
    rsvpSection: {
      en: string;
      vi: string;
    };
    thankYouSection: {
      en: string;
      vi: string;
      message: string;
    };
    footerCredit: string;
  };
  initialGuestbookEntries: GuestbookEntry[];
}

export const WEDDING_CONFIG: WeddingConfig = {
  seo: {
    title: "Văn Tuấn & Như Quỳnh · Thiệp Mời Cưới Online",
    description: "Trân trọng kính mời bạn đến chung vui cùng Văn Tuấn & Như Quỳnh.",
    siteName: "Văn Tuấn & Như Quỳnh Wedding",
    ogImage: "/uploads/cmum7s7rr002q8k3cioxfsj2a/1.png",
  },
  couple: {
    brideFirst: false,
    groom: {
      fullName: "Ninh Văn Tuấn",
      shortName: "Văn Tuấn",
      photo: {
        src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/4.jpg",
        alt: "Chú rể Văn Tuấn",
        width: 1708,
        height: 2560,
        crop: { x: 0, y: 0.0309, width: 1, height: 0.8896 },
      },
      bio: "",
    },
    bride: {
      fullName: "Vũ Như Quỳnh",
      shortName: "Như Quỳnh",
      photo: {
        src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/5.jpg",
        alt: "Cô dâu Như Quỳnh",
        width: 1708,
        height: 2560,
      },
      bio: "",
    },
  },
  families: {
    brideFamilyFirst: false,
    groom: {
      fatherName: "Nguyễn Văn Đoài",
      motherName: "Lê Thị Vui",
    },
    bride: {
      fatherName: "Nguyễn Đức Tuyên",
      motherName: "Đinh Thị Tuyết",
    },
  },
  coverPhoto: {
    src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/1.png",
    alt: "Văn Tuấn và Như Quỳnh",
    width: 455,
    height: 617,
  },
  events: {
    ceremony: {
      id: "ceremony",
      kind: "ceremony",
      englishSubtitle: "WEDDING CEREMONY",
      title: "Lễ Thành Hôn",
      subtitle: "Trân trọng kính mời quý vị đến chung vui cùng gia đình chúng tôi.",
      startAt: "2026-11-27T11:15:00+07:00",
      lunarLabel: "Tức ngày 19 tháng 10 năm Bính Ngọ",
      venueName: "TƯ GIA NHÀ TRAI",
      address: "Xóm 2, xã Bình Hòa, huyện Ý Yên, tỉnh Nam Định",
      mapUrl: "https://www.google.com/maps/place/Tu%E1%BA%A5n+Ninh+%C4%90%E1%BA%A1o+Qu%C3%A1n/@21.016415,105.7795979,21z/data=!4m14!1m7!3m6!1s0x31345518e40df1cb:0x2628e1e80c479714!2sSudico+HH3!8m2!3d21.016425!4d105.7795238!16s%2Fg%2F11vlwdsw0v!3m5!1s0x3134550074e3661d:0x310b9ad2d47db3e!8m2!3d21.0163964!4d105.7798255!16s%2Fg%2F11p1k5w2df?entry=ttu&g_ep=EgoyMDI2MTEwMS4wIKXMDSoASAFQAw%3D%3D",
      mapLat: 21.016409984511025,
      mapLng: 105.7798285983347
    },
    brideParty: {
      id: "groom-party",
      kind: "bride_party",
      sectionNumber: "04",
      englishSubtitle: "BRIDE'S RECEPTION",
      title: "TIỆC NHÀ GÁI",
      startAt: "2026-11-27T11:15:00+07:00",
      lunarLabel: "Tức ngày 19 tháng 10 năm Bính Ngọ",
      venueName: "TƯ GIA NHÀ GÁI",
      address: "Xóm 2, xã Bình Hòa, huyện Ý Yên, tỉnh Nam Định",
      mapUrl:
        "https://www.google.com/maps/place/Tu%E1%BA%A5n+Ninh+%C4%90%E1%BA%A1o+Qu%C3%A1n/@21.016415,105.7795979,21z/data=!4m14!1m7!3m6!1s0x31345518e40df1cb:0x2628e1e80c479714!2sSudico+HH3!8m2!3d21.016425!4d105.7795238!16s%2Fg%2F11vlwdsw0v!3m5!1s0x3134550074e3661d:0x310b9ad2d47db3e!8m2!3d21.0163964!4d105.7798255!16s%2Fg%2F11p1k5w2df?entry=ttu&g_ep=EgoyMDI2MTEwMS4wIKXMDSoASAFQAw%3D%3D",
      mapLat: 21.016409984511025,
      mapLng: 105.7798285983347
    },
    groomParty: {
      id: "bride-party",
      kind: "groom_party",
      sectionNumber: "05",
      englishSubtitle: "GROOM'S RECEPTION",
      title: "TIỆC NHÀ TRAI",
      startAt: "2026-11-27T11:15:00+07:00",
      lunarLabel: "Tức ngày 19 tháng 10 năm Bính Ngọ",
      venueName: "TƯ GIA NHÀ TRAI",
      address: "Xóm 2, xã Bình Hòa, huyện Ý Yên, tỉnh Nam Định",
      mapUrl: "https://www.google.com/maps/place/Tu%E1%BA%A5n+Ninh+%C4%90%E1%BA%A1o+Qu%C3%A1n/@21.016415,105.7795979,21z/data=!4m14!1m7!3m6!1s0x31345518e40df1cb:0x2628e1e80c479714!2sSudico+HH3!8m2!3d21.016425!4d105.7795238!16s%2Fg%2F11vlwdsw0v!3m5!1s0x3134550074e3661d:0x310b9ad2d47db3e!8m2!3d21.0163964!4d105.7798255!16s%2Fg%2F11p1k5w2df?entry=ttu&g_ep=EgoyMDI2MTEwMS4wIKXMDSoASAFQAw%3D%3D",
      mapLat: 21.016409984511025,
      mapLng: 105.7798285983347,
    },
  },
  countdownEventId: "ceremony",
  album: [
    {
      src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/4.jpg",
      alt: "Khoảnh khắc hạnh phúc 01",
      width: 1708,
      height: 2560,
    },
    {
      src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/5.jpg",
      alt: "Khoảnh khắc hạnh phúc 02",
      width: 1708,
      height: 2560,
    },
    {
      src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/4.jpg",
      alt: "Khoảnh khắc hạnh phúc 03",
      width: 1708,
      height: 2560,
    },
    {
      src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/5.jpg",
      alt: "Khoảnh khắc hạnh phúc 04",
      width: 1708,
      height: 2560,
    },
    {
      src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/4.jpg",
      alt: "Khoảnh khắc hạnh phúc 05",
      width: 1708,
      height: 2560,
    },
    {
      src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/5.jpg",
      alt: "Khoảnh khắc hạnh phúc 06",
      width: 1708,
      height: 2560,
    },
    {
      src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/4.jpg",
      alt: "Khoảnh khắc hạnh phúc 07",
      width: 1708,
      height: 2560,
    },
    {
      src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/5.jpg",
      alt: "Khoảnh khắc hạnh phúc 08",
      width: 1708,
      height: 2560,
    },
    {
      src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/4.jpg",
      alt: "Khoảnh khắc hạnh phúc 09",
      width: 1708,
      height: 2560,
    },
    {
      src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/5.jpg",
      alt: "Khoảnh khắc hạnh phúc 10",
      width: 1708,
      height: 2560,
      crop: { x: 0, y: 0, width: 1, height: 0.834 },
    },
  ],
  gifts: [
    {
      side: "groom",
      title: "Chú Rể",
      englishLabel: "GROOM",
      accountName: "NINH VĂN TUẤN",
      bankName: "Quét mã QR ngân hàng",
      accountNumber: "",
      qrImage: {
        src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/6.jpg",
        alt: "Mã QR Mừng Cưới Chú Rể Văn Tuấn",
        width: 1000,
        height: 1019,
      },
    },
    {
      side: "bride",
      title: "Cô Dâu",
      englishLabel: "BRIDE",
      accountName: "VŨ NHƯ QUỲNH",
      bankName: "Quét mã QR ngân hàng",
      accountNumber: "",
      qrImage: {
        src: "/uploads/cmum7s7rr002q8k3cioxfsj2a/6.jpg",
        alt: "Mã QR Mừng Cưới Cô Dâu Như Quỳnh",
        width: 1000,
        height: 1030,
      },
    },
  ],
  music: {
    src: "/music/beautiful-in-white.mp3",
    autoplay: true,
  },
  labels: {
    coverEyebrow: "We're getting married",
    coverInviteUpper: "Trân trọng kính mời",
    coverInviteLower: "đến dự buổi tiệc chung vui cùng gia đình",
    openButton: "Mở thiệp",
    coupleSection: {
      index: "01",
      en: "THE BRIDE & GROOM",
      vi: "Cô Dâu & Chú Rể",
    },
    familySection: {
      index: "02",
      en: "OUR BELOVED FAMILIES",
      vi: "Hai Bên Gia Đình",
      groomSide: "Nhà Trai",
      brideSide: "Nhà Gái",
    },
    invitationIntro: {
      line1: "Trân trọng kính mời quý vị tới dự",
      line2: "Lễ Thành Hôn của con chúng tôi",
      ceremonyPrefix: "được cử hành trang trọng tại",
      atTimePrefix: "Vào lúc ",
    },
    albumSection: {
      index: "03",
      en: "CAPTURED MOMENTS",
      vi: "Album Cưới",
    },
    guestbookSection: {
      index: "06",
      en: "WEDDING GUESTBOOK",
      vi: "Sổ Lưu Bút",
      subtitle: "Để lại đôi lời thân thương cho cô dâu chú rể",
      formTitle: "Gửi lời chúc",
    },
    giftSection: {
      index: "07",
      en: "WEDDING GIFT",
      vi: "Mừng Cưới",
      buttonLabel: "Mừng cưới",
      note: "Sự hiện diện của quý khách đã là món quà ý nghĩa nhất với chúng mình.",
      modalSubtitle: "Quét mã QR hoặc sao chép số tài khoản",
    },
    countdownSection: {
      index: "08",
      en: "SAVE THE DATE",
      vi: "Đếm Ngược Ngày",
      todayMessage: "Hôm nay là ngày trọng đại!",
    },
    rsvpSection: {
      en: "R.S.V.P",
      vi: "Xác Nhận Tham Dự",
    },
    thankYouSection: {
      en: "FOREVER & ALWAYS · THANK YOU",
      vi: "Trân trọng cảm ơn",
      message: "",
    },
    footerCredit: "THIỆP CƯỚI ĐÌNH QUÂN - THẠCH THẤT",
  },
  initialGuestbookEntries: [],
};

