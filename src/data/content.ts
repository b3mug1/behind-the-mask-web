import type { LucideIcon } from 'lucide-react'
import { Eye, ShieldCheck, HeartHandshake, LockKeyhole, RotateCcw } from 'lucide-react'

export type Principle = {
  number: string
  heading: string
  statement: string
  explanation: string
  example: string
  Icon: LucideIcon
}

export type ScenarioOption = {
  id: string
  label: string
  feedback: string
}

export type Scenario = {
  id: string
  category: string
  title: string
  message: string
  options: ScenarioOption[]
  reflection: string
}

export const principles: Principle[] = [
  {
    number: '01',
    heading: 'Respect',
    statement: 'Respect people, even anonymously.',
    explanation: 'A hidden identity does not justify humiliating another person. Challenge ideas without attacking individuals.',
    example: 'Instead of “You’re stupid,” explain why you disagree.',
    Icon: HeartHandshake,
  },
  {
    number: '02',
    heading: 'Verify',
    statement: 'Verify before sharing.',
    explanation: 'Check information before reposting it. A false claim can cause real harm even if the sender is anonymous.',
    example: 'Open the original source before forwarding a shocking claim.',
    Icon: Eye,
  },
  {
    number: '03',
    heading: 'Do no harm',
    statement: 'Never bully or harass.',
    explanation: 'Do not use anonymity to threaten, mock, intimidate, or target someone.',
    example: 'If a student is insulted, consider supporting them or reporting the messages.',
    Icon: ShieldCheck,
  },
  {
    number: '04',
    heading: 'Protect privacy',
    statement: 'Protect others’ privacy.',
    explanation: 'Do not share another person’s information, photographs, or conversations without permission.',
    example: 'Ask for consent before reposting an embarrassing photograph.',
    Icon: LockKeyhole,
  },
  {
    number: '05',
    heading: 'Take responsibility',
    statement: 'Own your words and actions.',
    explanation: 'If you make a mistake, acknowledge it and correct it. Responsibility does not depend on a visible name.',
    example: 'If you share misinformation, correct the claim and explain the mistake.',
    Icon: RotateCcw,
  },
]

export const scenarios: Scenario[] = [
  {
    id: 'insult',
    category: 'Online harassment',
    title: 'A student is being insulted in a group chat.',
    message: 'Several people start mocking a classmate. The classmate has stopped replying. What would you do?',
    options: [
      { id: 'defend', label: 'Speak up and ask people to stop.', feedback: 'A public response can set a boundary and show the person they are not alone. Consider their wishes and your safety before responding.' },
      { id: 'report', label: 'Report the abusive messages.', feedback: 'Reporting can bring in moderation without escalating the conversation. It may be especially useful when direct replies could make things worse.' },
      { id: 'private', label: 'Check on the person privately.', feedback: 'Private support can respect the person’s preferences. It may help to ask whether they want you to report or intervene too.' },
      { id: 'ignore', label: 'Stay out of the conversation.', feedback: 'You may have reasons to avoid a public argument. Still, consider a safer way to offer support or report abuse if someone is being harmed.' },
    ],
    reflection: 'There is more than one way to help. The important question is how to reduce harm while respecting the affected person.',
  },
  {
    id: 'misinformation',
    category: 'Misinformation',
    title: 'You shared a claim that turns out to be false.',
    message: 'A friend points out that your post used an unreliable source. Other students may already have seen it. What now?',
    options: [
      { id: 'correct', label: 'Post a correction and acknowledge the mistake.', feedback: 'A visible correction helps people who saw the original claim. It also shows that responsibility includes repairing an error.' },
      { id: 'delete', label: 'Delete the post quietly.', feedback: 'Removing the claim can stop further spread, but people who already saw it may still believe it. A short correction may help them.' },
      { id: 'check', label: 'Check the source first, then respond.', feedback: 'Verifying the facts before responding is careful. If the claim was false, let people know clearly once you have checked.' },
      { id: 'leave', label: 'Leave it unchanged.', feedback: 'Doing nothing may let the false claim continue spreading. Consider whether you can correct it without blaming yourself or others.' },
    ],
    reflection: 'Owning a mistake is about reducing its effect, not performing a perfect public apology.',
  },
  {
    id: 'photo',
    category: 'Privacy',
    title: 'A classmate’s private photograph is shared.',
    message: 'Someone forwards an embarrassing photograph of another student without permission. What would you do?',
    options: [
      { id: 'remove', label: 'Ask the sender to remove it.', feedback: 'Asking for removal addresses the immediate privacy harm. Avoid forwarding the image while you raise the concern.' },
      { id: 'support', label: 'Contact the person pictured privately.', feedback: 'This gives the person a chance to decide what support they want. Be careful not to send the image around again.' },
      { id: 'report', label: 'Report the post to a moderator.', feedback: 'Reporting may help remove the image, especially if a direct request is ignored. Share only the minimum information needed.' },
      { id: 'forward', label: 'Forward it to others as a warning.', feedback: 'The intention may be to warn people, but forwarding also spreads the private image. A direct request or report can reduce harm without redistributing it.' },
    ],
    reflection: 'Privacy belongs to the person in the photograph. Help without creating a second copy of the harm.',
  },
]

export const team = [
  'Bekzat Murat',
  'Akerke Tastemir',
  'Zumrad Sherbadalova',
  'Maqsat Syrtbay',
  'Sultantore Tulkibai',
] as const
