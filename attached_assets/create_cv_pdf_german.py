#!/usr/bin/env python3

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib import colors
import os

def create_cv_pdf_german():
    # Create the PDF document
    doc = SimpleDocTemplate("Saad_Hasan_CV_Updated_German.pdf", 
                          pagesize=A4,
                          rightMargin=72, leftMargin=72,
                          topMargin=72, bottomMargin=18)
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=12,
        textColor=HexColor('#2c5aa0'),
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=6,
        spaceBefore=12,
        textColor=HexColor('#2c5aa0'),
        borderWidth=1,
        borderColor=HexColor('#2c5aa0'),
        borderPadding=3
    )
    
    contact_style = ParagraphStyle(
        'ContactStyle',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=3,
        alignment=TA_CENTER,
        textColor=HexColor('#333333')
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=6,
        textColor=HexColor('#333333')
    )
    
    # Build the document content
    story = []
    
    # Header with image and contact info
    try:
        # Create a table for header layout
        from PIL import Image as PILImage
        import tempfile
        
        # Load and rotate the image
        pil_img = PILImage.open("Saad Hasan avatar.jpg")
        # Rotate 180 degrees to fix orientation
        rotated_img = pil_img.rotate(180, expand=True)
        
        # Save to temporary file
        temp_path = "temp_rotated_avatar_de.jpg"
        rotated_img.save(temp_path, "JPEG")
        
        profile_img = Image(temp_path, width=1.2*inch, height=1.2*inch)
        
        header_data = [
            [profile_img, Paragraph('<b>Saad Hasan</b>', title_style)],
            ['', Paragraph('Oststraße 17, 09212 Limbach-Oberfrohna, Deutschland', contact_style)],
            ['', Paragraph('E-Mail: saadhasan07@gmail.com | Telefon: +4917622359115', contact_style)],
            ['', Paragraph('GitHub: github.com/saadhasan07<br/>XING: https://www.xing.com/profile/Saad_Hasan2/', contact_style)]
        ]
        
        header_table = Table(header_data, colWidths=[1.5*inch, 4.5*inch])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ALIGN', (0, 0), (0, -1), 'CENTER'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('SPAN', (0, 0), (0, 3)),
        ]))
        
        story.append(header_table)
        story.append(Spacer(1, 20))
        
    except Exception as e:
        # Fallback without image
        story.append(Paragraph('<b>Saad Hasan</b>', title_style))
        story.append(Paragraph('Oststraße 17, 09212 Limbach-Oberfrohna, Deutschland', contact_style))
        story.append(Paragraph('E-Mail: saadhasan07@gmail.com | Telefon: +4917622359115', contact_style))
        story.append(Paragraph('GitHub: github.com/saadhasan07 | XING: https://www.xing.com/profile/Saad_Hasan2/', contact_style))
        story.append(Spacer(1, 12))
    
    # About Me section
    story.append(Paragraph('<b>Über mich</b>', heading_style))
    story.append(Paragraph(
        'AWS-zertifizierter Cloud Practitioner und DevOps-Fachkraft mit umfassender Ausbildung in Cloud Computing, '
        'Containerisierung und CI/CD-Pipelines. Abgeschlossene Expertenausbildung in Cloud- und Webentwicklung bei der '
        'Techstarter GmbH (600+ Stunden). Spezialisiert auf Docker, Kubernetes, Terraform, Jenkins, GitHub Actions und '
        'Infrastruktur-Automatisierung. Erfahren in Python, JavaScript, React, Node.js und Datenbankmanagement mit '
        'solider Grundlage in Linux, Netzwerktechnik und Cybersicherheit.',
        normal_style
    ))
    
    # Skills section
    story.append(Paragraph('<b>Fähigkeiten</b>', heading_style))
    skills_text = '''
    • DevOps-Praktiken | CI/CD-Pipelines | Automatisierung<br/>
    • AWS Cloud Grundlagen | Cloud Computing Konzepte<br/>
    • Python Entwicklung | JavaScript & TypeScript | Full-Stack Webentwicklung<br/>
    • Git & GitHub | Web-Technologien (HTML, CSS)<br/>
    • Infrastruktur-Monitoring | Agile und Scrum Methoden<br/>
    • Problemlösung & Debugging
    '''
    story.append(Paragraph(skills_text, normal_style))
    
    # Projects section
    story.append(Paragraph('<b>DevOps und Automatisierungs-Projekte</b>', heading_style))
    story.append(Paragraph(
        'Entwicklung technischer Projekte zur Demonstration von Expertise in CI/CD, Automatisierung, '
        'Full-Stack-Entwicklung und professioneller Dokumentation.',
        normal_style
    ))
    
    projects = [
        ('Hashify (JavaScript)', 
         'Eine moderne Musik-Player-Anwendung mit mehreren Player-Interfaces, Playlist-Management, Suchfunktionalität mit Verlaufsverfolgung, Echtzeit-Audio-Visualisierung, responsivem Design, Benutzerauthentifizierung und Theme-Anpassung mit Hell/Dunkel-Modus-Unterstützung.',
         'https://github.com/saadhasan07/Hashify'),
        ('Gaming Profile App (JavaScript)',
         'Eine umfassende soziale Gaming-Plattform, die Benutzern ermöglicht, interaktive Gaming-Erfahrungen zu entdecken, zu teilen und sich zu vernetzen. Bietet Benutzerauthentifizierung, anpassbare Profile, Echtzeit-Messaging, Bestenlisten und Spiel-Integration mit WebSocket-gestützter Echtzeit-Kommunikation.',
         'https://github.com/saadhasan07/gaming-profile-app'),
        ('CI/CD Pipeline Monitor (TypeScript)',
         'Eine moderne Webanwendung zur Überwachung und Verwaltung von CI/CD-Pipelines mit Echtzeit-Visualisierung, Blue/Green-Deployment-Strategie, umfassendem Metriken-Dashboard und Umgebungsmanagement für Entwicklung, Test, Staging und Produktion.',
         'https://github.com/saadhasan07/cicd-pipeline-monitor'),
        ('Total Battle Scanner (Python)',
         'Ein leistungsstarkes Python-Scanning-Tool für das Total Battle-Spiel mit Ressourcenerkennung (Silber, Barren, Holz, Stein), Spielerstatus-Überwachung, Schild-Erkennung, kontinuierlichem Scanning mit konfigurierbaren Verzögerungen und moderner UI mit Dark/Light-Theme-Unterstützung.',
         'https://github.com/saadhasan07/total-battle-scanner')
    ]
    
    for title, desc, url in projects:
        story.append(Paragraph(f'<b>• {title}</b>', normal_style))
        story.append(Paragraph(f'  {desc}', normal_style))
        story.append(Paragraph(f'  GitHub: {url}', normal_style))
        story.append(Spacer(1, 6))
    
    # Professional Experience
    story.append(Paragraph('<b>Berufserfahrung</b>', heading_style))
    story.append(Paragraph('<b>DevOps und Cloud Computing Weiterbildung</b>', normal_style))
    story.append(Paragraph('<i>September 2023 – November 2024 | Techstarter GmbH München</i>', normal_style))
    story.append(Paragraph(
        'Erfolgreich abgeschlossene umfassende DevOps- und Cloud Computing-Weiterbildung. Praktische Erfahrungen mit '
        'CI/CD-Pipelines, Containerisierung, Cloud-Infrastruktur und Automatisierung gesammelt. Zertifizierungen in '
        'AWS Cloud Practitioner und Scrum Fundamentals während des Programms erworben.',
        normal_style
    ))
    
    # Education
    story.append(Paragraph('<b>Bildung</b>', heading_style))
    story.append(Paragraph('<b>Bachelor of Commerce (B.Com), Notendurchschnitt 1,7</b>', normal_style))
    story.append(Paragraph('<i>März 2012 – Juli 2014 | Dhadabhoy University, Karachi (Pakistan)</i>', normal_style))
    story.append(Paragraph('Spezialisierung: Management und Wirtschaft, Logistik', normal_style))
    
    # Certifications
    story.append(Paragraph('<b>Zertifizierungen</b>', heading_style))
    cert_text = '''
    ✓ AWS Certified Cloud Practitioner (Bestanden)<br/>
    ✓ Scrum Fundamentals Certified (SFC) (Bestanden)<br/>
    ✓ Techstarter GmbH – DevOps und Cloud Computing Weiterbildung (Abgeschlossen November 2024)
    '''
    story.append(Paragraph(cert_text, normal_style))
    
    # Languages
    story.append(Paragraph('<b>Sprachen</b>', heading_style))
    lang_text = '''
    • Englisch (Fließend)<br/>
    • Urdu (Muttersprache)<br/>
    • Deutsch (B1 Zertifiziert, Mittelstufe)
    '''
    story.append(Paragraph(lang_text, normal_style))
    
    # Build PDF
    doc.build(story)
    print("German CV PDF created successfully!")

if __name__ == "__main__":
    create_cv_pdf_german()