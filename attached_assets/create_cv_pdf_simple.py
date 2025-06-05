from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import black
from reportlab.lib import colors
from reportlab.platypus.flowables import Image
import os

def create_cv_pdf():
    # Create PDF
    doc = SimpleDocTemplate("Saad_Hasan_CV_Updated_English.pdf", pagesize=letter,
                           rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    
    # Container for story
    story = []
    
    # Get styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=black,
        alignment=1,  # Center alignment
        spaceAfter=6,
        fontName='Helvetica-Bold'
    )
    
    contact_style = ParagraphStyle(
        'ContactStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=black,
        alignment=1,  # Center alignment
        spaceAfter=3,
        fontName='Helvetica'
    )
    
    heading_style = ParagraphStyle(
        'HeadingStyle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=black,
        spaceAfter=6,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'NormalStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=black,
        spaceAfter=6,
        fontName='Helvetica',
        alignment=0  # Left alignment
    )
    
    # Add profile image at the top
    try:
        image_path = "Saad Hasan avatar.jpg"
        if os.path.exists(image_path):
            # Create a simple centered image
            profile_img = Image(image_path, width=1.2*inch, height=1.2*inch)
            img_data = [[profile_img]]
            img_table = Table(img_data, colWidths=[7*inch])
            img_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ]))
            story.append(img_table)
            story.append(Spacer(1, 12))
        else:
            print(f"Image file not found: {image_path}")
    except Exception as e:
        print(f"Error adding profile image: {e}")
    
    # Header
    story.append(Paragraph('<b>Saad Hasan</b>', title_style))
    story.append(Paragraph('Oststraße 17, 09212 Limbach-Oberfrohna, Germany', contact_style))
    story.append(Paragraph('Email: saadhasan07@gmail.com | Phone: +4917622359115', contact_style))
    story.append(Paragraph('GitHub: github.com/saadhasan07 | XING: https://www.xing.com/profile/Saad_Hasan2/', contact_style))
    story.append(Spacer(1, 12))
    
    # About Me section
    story.append(Paragraph('<b>About Me</b>', heading_style))
    about_text = """AWS Certified Cloud Practitioner and DevOps professional with comprehensive training in cloud computing, containerization, and CI/CD pipelines. Completed Expert-level Cloud and Web Development certification from Techstarter GmbH (600+ hours). Specialized in Docker, Kubernetes, Terraform, Jenkins, GitHub Actions, and infrastructure automation. Experienced in Python, JavaScript, React, Node.js, and database management with strong foundation in Linux, networking, and cybersecurity."""
    story.append(Paragraph(about_text, normal_style))
    story.append(Spacer(1, 12))
    
    # Skills section
    story.append(Paragraph('<b>Skills</b>', heading_style))
    skills = [
        "• DevOps Practices | CI/CD Pipelines | Automation Scripting",
        "• AWS Cloud Fundamentals | Cloud Computing Concepts",
        "• Python Development | JavaScript & TypeScript | Full-Stack Web Development",
        "• Git & GitHub | Web Technologies (HTML, CSS)",
        "• Infrastructure Monitoring Concepts | Agile and Scrum Methodologies",
        "• Problem Solving & Debugging"
    ]
    for skill in skills:
        story.append(Paragraph(skill, normal_style))
    story.append(Spacer(1, 12))
    
    # Projects section
    story.append(Paragraph('<b>DevOps and Automation Projects</b>', heading_style))
    story.append(Paragraph('Designed and developed technical projects demonstrating expertise in CI/CD, automation scripting, full-stack development, and professional documentation.', normal_style))
    
    projects = [
        {
            "title": "Hashify (JavaScript)",
            "description": "A modern music player application with multiple player interfaces, playlist management, search functionality with history tracking, real-time audio visualization, responsive design, user authentication, and theme customization with light/dark mode support.",
            "github": "https://github.com/saadhasan07/Hashify"
        },
        {
            "title": "Gaming Profile App (JavaScript)",
            "description": "A comprehensive social gaming platform enabling users to discover, share, and connect through interactive gaming experiences. Features user authentication, customizable profiles, real-time messaging, leaderboards, and game integration with WebSocket-powered real-time communications.",
            "github": "https://github.com/saadhasan07/gaming-profile-app"
        },
        {
            "title": "CI/CD Pipeline Monitor (TypeScript)",
            "description": "A modern web application for monitoring and managing CI/CD pipelines with real-time visualization, blue/green deployment strategy, comprehensive metrics dashboard, and environment management across Development, Testing, Staging, and Production.",
            "github": "https://github.com/saadhasan07/cicd-pipeline-monitor"
        },
        {
            "title": "Total Battle Scanner (Python)",
            "description": "A powerful Python scanning tool for Total Battle game featuring resource detection (Silver, Ingots, Wood, Stone), player status monitoring, shield detection, continuous scanning with configurable delays, and modern UI with dark/light theme support.",
            "github": "https://github.com/saadhasan07/total-battle-scanner"
        }
    ]
    
    for project in projects:
        story.append(Paragraph(f'• <b>{project["title"]}</b>', normal_style))
        story.append(Paragraph(project["description"], normal_style))
        story.append(Paragraph(f'GitHub: {project["github"]}', normal_style))
        story.append(Spacer(1, 6))
    
    story.append(Spacer(1, 12))
    
    # Professional Experience
    story.append(Paragraph('<b>Professional Experience</b>', heading_style))
    story.append(Paragraph('<b>DevOps and Cloud Computing Training</b>', normal_style))
    story.append(Paragraph('September 2023 – November 2024 | Techstarter GmbH München', normal_style))
    story.append(Paragraph('Successfully completed comprehensive DevOps and Cloud Computing training program. Gained hands-on experience with CI/CD pipelines, containerization, cloud infrastructure, and automation scripting. Achieved certification in AWS Cloud Practitioner and Scrum Fundamentals during the program.', normal_style))
    story.append(Spacer(1, 12))
    
    # Education
    story.append(Paragraph('<b>Education</b>', heading_style))
    story.append(Paragraph('<b>Bachelor of Commerce (B.Com), GPA 1.7</b>', normal_style))
    story.append(Paragraph('March 2012 – July 2014 | Dhadabhoy University, Karachi (Pakistan)', normal_style))
    story.append(Paragraph('Specialization: Management and Economics, Logistics', normal_style))
    story.append(Spacer(1, 12))
    
    # Certifications
    story.append(Paragraph('<b>Certifications</b>', heading_style))
    certifications = [
        "✓ AWS Certified Cloud Practitioner (Passed)",
        "✓ Scrum Fundamentals Certified (SFC) (Passed)",
        "✓ Techstarter GmbH – DevOps and Cloud Computing Training (Completed November 2024)"
    ]
    for cert in certifications:
        story.append(Paragraph(cert, normal_style))
    story.append(Spacer(1, 12))
    
    # Languages
    story.append(Paragraph('<b>Languages</b>', heading_style))
    languages = [
        "• English (Fluent)",
        "• Urdu (Native)",
        "• German (B1 Certified, Intermediate)"
    ]
    for lang in languages:
        story.append(Paragraph(lang, normal_style))
    
    # Build PDF
    doc.build(story)
    print("CV PDF created successfully!")

if __name__ == "__main__":
    create_cv_pdf()