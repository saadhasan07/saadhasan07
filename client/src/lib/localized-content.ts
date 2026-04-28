import type { BlogPost, Experience, Profile, Talk } from "@shared/schema";

type Language = "en" | "de";

const germanProfileContent = {
  title: "DevOps- und Cloud-Computing-Professional",
  bio: "Motivierter DevOps- und Cloud-Computing-Professional mit einer starken Grundlage in CI/CD-Pipelines, Automatisierungsskripten und Infrastruktur-Monitoring. AWS Certified Cloud Practitioner und Scrum Fundamentals Certified. Ich entwickle gerne skalierbare Lösungen, verbessere die Systemzuverlassigkeit und treibe agile Projekte voran.",
};

const germanExperienceContent: Record<number, Partial<Experience>> = {
  1: {
    title: "DevOps- und Cloud-Computing-Weiterbildung",
    description:
      "Intensive Weiterbildung mit Fokus auf DevOps-Praktiken, CI/CD-Pipelines, Automatisierungsskripten, AWS-Cloud-Grundlagen und Infrastruktur-Monitoring.",
    endDate: null,
  },
  2: {
    title: "Bachelor of Commerce (B.Com)",
    description:
      "Abgeschlossenes Bachelorstudium mit einem Schwerpunkt auf Management, Wirtschaft und Logistik. Solide Grundlage in Geschaftsprozessen und organisatorischem Management.",
  },
  3: {
    title: "Kommunikationsmanager",
    description:
      "Verantwortlich fur internationale Kundenkommunikation, Vertragsverhandlungen und Exportdokumentation. Erstellung von Logistikstatistiken, Koordination von Zahlungen und Optimierung von Kommunikationsablaufen.",
  },
  4: {
    title: "Schichtleiter",
    description:
      "Verantwortlich fur Schichtplanung, Kundenservice und organisatorische Aufgaben. Leitung des Teams und Steuerung des Tagesgeschafts in einem dynamischen Arbeitsumfeld.",
  },
};

const germanBlogContent: Record<number, Partial<BlogPost>> = {
  1: {
    title: "CI/CD-Pipelines mit Best Practices umsetzen",
    excerpt:
      "Ein praxisnaher Leitfaden fur robuste CI/CD-Pipelines mit Fokus auf Automatisierung, Tests und Deployment-Strategien fur moderne DevOps-Workflows.",
    publishedAt: "15. Dezember 2024",
    readTime: "8 Min. Lesezeit",
  },
  2: {
    title: "AWS-Cloud-Infrastruktur uberwachen und optimieren",
    excerpt:
      "Effektive Strategien fur Monitoring, Kostenoptimierung und hohe Systemzuverlassigkeit in AWS-Umgebungen.",
    publishedAt: "28. November 2024",
    readTime: "6 Min. Lesezeit",
  },
};

const germanTalkContent: Record<number, Partial<Talk>> = {
  1: {
    title: "DevOps-Grundlagen und Best Practices",
    event: "Techstarter GmbH Schulung",
    description:
      "Vorstellung zentraler DevOps-Konzepte wie CI/CD-Implementierung, Infrastruktur-Automatisierung und Monitoring-Strategien fur andere Teilnehmende.",
    date: "November 2024",
  },
  2: {
    title: "Uberblick uber AWS-Cloud-Services",
    event: "Interner Schulungsworkshop",
    description:
      "Verstandlicher Uberblick uber AWS-Services mit Fokus auf praktische Einsatze in DevOps und Infrastruktur-Management.",
    date: "Oktober 2024",
  },
};

export function getLocalizedProfile(profile: Profile, language: Language) {
  if (language !== "de") {
    return {
      title: profile.title,
      bio: profile.bio,
    };
  }

  return {
    title: germanProfileContent.title || profile.title,
    bio: germanProfileContent.bio || profile.bio,
  };
}

export function getLocalizedExperience(experience: Experience, language: Language) {
  if (language !== "de") {
    return {
      title: experience.title,
      organization: experience.organization,
      description: experience.description,
      startDate: experience.startDate,
      endDate: experience.endDate,
    };
  }

  const localized = germanExperienceContent[experience.id];

  return {
    title: localized?.title || experience.title,
    organization: localized?.organization || experience.organization,
    description: localized?.description || experience.description,
    startDate: localized?.startDate || experience.startDate,
    endDate: localized?.endDate === undefined ? experience.endDate : localized.endDate,
  };
}

export function getLocalizedBlogPost(post: BlogPost, language: Language) {
  if (language !== "de") {
    return {
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
    };
  }

  const localized = germanBlogContent[post.id];

  return {
    title: localized?.title || post.title,
    excerpt: localized?.excerpt || post.excerpt,
    publishedAt: localized?.publishedAt || post.publishedAt,
    readTime: localized?.readTime || post.readTime,
  };
}

export function getLocalizedTalk(talk: Talk, language: Language) {
  if (language !== "de") {
    return {
      title: talk.title,
      event: talk.event,
      description: talk.description,
      date: talk.date,
    };
  }

  const localized = germanTalkContent[talk.id];

  return {
    title: localized?.title || talk.title,
    event: localized?.event || talk.event,
    description: localized?.description || talk.description,
    date: localized?.date || talk.date,
  };
}
