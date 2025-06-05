// Static data for GitHub Pages deployment using your actual portfolio content
export const staticProfile = {
  id: 1,
  name: "Saad Hasan",
  title: "DevOps & Cloud Computing Specialist",
  bio: "Passionate about automating infrastructure, implementing CI/CD pipelines, and leveraging cloud technologies to build scalable, reliable systems. Experienced in containerization, microservices architecture, and modern DevOps practices.",
  email: "contact@saadhasan.dev",
  location: "Germany",
  avatar: "/attached_assets/Saad%20Hasan%20avatar.jpg",
  github: "https://github.com/saadhasan07",
  linkedin: "https://linkedin.com/in/saad-hasan",
  skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Python", "Node.js", "React"]
};

export const staticProjects = [
  {
    id: 14,
    title: "Hashify",
    description: "A modern hash generation and verification tool built with React and Node.js. Features multiple hashing algorithms, real-time generation, and secure verification capabilities.",
    technologies: ["React", "Node.js", "Express", "Crypto"],
    githubUrl: "https://github.com/saadhasan07/hashify",
    liveUrl: "https://hashify-demo.com",
    image: "",
    featured: true,
    category: "Web Development"
  }
];

export const staticExperiences = [
  {
    id: 1,
    title: "DevOps and Cloud Computing Certification",
    company: "Techstarter",
    location: "Hamburg, Germany", 
    startDate: "2023-01-01",
    endDate: "2024-12-31",
    current: true,
    description: "Comprehensive training in modern DevOps practices, cloud architecture, and automation technologies. Focus on AWS services, containerization, and CI/CD implementation.",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Python"]
  }
];

export const staticBlogPosts = [
  {
    id: 1,
    title: "Implementing CI/CD Pipelines with GitHub Actions",
    excerpt: "A comprehensive guide to setting up automated deployment pipelines using GitHub Actions, including testing, security scanning, and multi-environment deployments.",
    content: "Learn how to create robust CI/CD pipelines...",
    publishedAt: "2024-01-15",
    featured: true,
    tags: ["CI/CD", "GitHub Actions", "DevOps", "Automation"]
  }
];

export const staticTalks = [
  {
    id: 1,
    title: "DevOps Fundamentals and Best Practices",
    event: "Tech Meetup Hamburg",
    date: "2024-03-15",
    description: "Presentation covering essential DevOps principles, tool selection, and implementation strategies for modern software development teams.",
    topics: ["DevOps Culture", "Tool Selection", "Automation", "Monitoring"]
  }
];