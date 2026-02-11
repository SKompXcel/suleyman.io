import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({ children, ...props }: { children: React.ReactNode, title: string }) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({ title, href, children }: { title?: string, href?: string, children: React.ReactNode }) {
  return (
    <Card as="li">
      {title && <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>}
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Uses',
  description: 'Software I use, gadgets I love, and other things I recommend.',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="Software I use, gadgets I love, and other things I recommend."
      intro="I get asked a lot about the things I use to build software, stay productive, or buy to fool myself into thinking I’m being productive when I’m really just procrastinating. Here’s a big list of all of my favorite stuff."
    >
      <div className="space-y-20">
        <ToolsSection title="Workstation">
          <Tool title="Desktop Computer">
            My primary workstation features high-end specs, perfect for demanding software and development tasks.
          </Tool>
          <ToolsSection title="Important Specs">
            <Tool>
              - <b>GPU:</b> Gigabyte 3080 OC 12 GB VRAM<br/>
              - <b>Processor:</b> AMD Ryzen 9 5900X<br/>
              - <b>Storage:</b> 1 TB M.2 NVMe SSD, 2 TB SSD<br/>
              - <b>Cooling:</b> Corsair water cooling block<br/>
            </Tool>
          </ToolsSection>
          <Tool title="Laptop">
            For mobile work, I use a 16-inch MacBook Pro 2022 with the M1 Pro chip and Liquid Retina XDR display.
          </Tool>
          <ToolsSection title="Important Specs">
            <Tool>
              - <b>Display:</b> 16’’ Liquid Retina XDR, 3456 x 2234 px<br/>
              - <b>Processor:</b> Apple M1 Pro<br/>
              - <b>RAM:</b> 16 GB<br/>
              - <b>Storage:</b> 494.38 GB<br/>
            </Tool>
          </ToolsSection>
        </ToolsSection>
        <ToolsSection title="Development tools">
          <Tool title="Visual Studio Code">
            My go-to code editor for most of my development work.
          </Tool>
          <Tool title="Cursor">
            I also use Cursor as a secondary code editor for specific projects.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Cloud & Deployment">
          <Tool title="Vercel">
            I use Vercel to deploy web applications with ease, perfect for Next.js projects.
          </Tool>
          <Tool title="AWS">
            I leverage AWS for various services:
            <ul>
              <li><b>S3:</b> For scalable storage</li>
              <li><b>CloudFront:</b> To deliver content with low latency</li>
              <li><b>Route 53:</b> For domain registration and DNS management</li>
              <li><b>Lambda & EC2:</b> For serverless and scalable compute</li>
            </ul>
          </Tool>
        </ToolsSection>
        <ToolsSection title="Design">
          <Tool title="Figma">
            My choice for UI design due to its versatility and intuitive features.
          </Tool>
          <Tool title="Canva">
            Useful for quick designs, especially for social media and personal projects.
          </Tool>
          <Tool title="DaVinci Resolve">
            My go-to for video editing projects, offering advanced editing tools.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Platform">
          <Tool title="GitHub">
            Essential for my development workflow, from personal projects to collaborative work.
          </Tool>
          <Tool title="Discord">
            I use Discord daily for community interactions and personal conversations.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Productivity">
          <Tool title="Notion">
            Organizes my daily tasks and long-term goals, keeping me on track.
          </Tool>
          <Tool title="GitHub Kanban Board">
            Ideal for managing and tracking project progress.
          </Tool>
          <Tool title="Calendly">
            A reliable tool for scheduling meetings with clients and friends.
          </Tool>
          <Tool title="Google Meet, Zoom, Microsoft Teams">
            Used for virtual meetings as needed.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Others">
          <Tool title="Microsoft PowerPoint or Google Slides">
            Frequently used for creating presentations.
          </Tool>
          <Tool title="Microsoft Excel or Google Sheets">
            Preferred for data analysis and tracking.
          </Tool>
          <Tool title="Microsoft Word or Google Docs">
            My go-to for document creation and collaboration.
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}
