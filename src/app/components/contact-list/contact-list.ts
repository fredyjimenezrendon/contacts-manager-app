import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contact, PagedResponse } from '../../models/contact.model';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-list',
  imports: [RouterLink],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit {
  private readonly contactService = inject(ContactService);

  contacts = signal<Contact[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  pageSize = signal(10);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.contactService.getContacts(this.currentPage(), this.pageSize()).subscribe({
      next: (response: PagedResponse<Contact>) => {
        this.contacts.set(response.content);
        this.totalPages.set(response.totalPages);
        this.totalElements.set(response.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load contacts. Please try again.');
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadContacts();
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  deleteContact(id: string, event: Event): void {
    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this contact?')) return;

    this.contactService.deleteContact(id).subscribe({
      next: () => this.loadContacts(),
      error: () => this.error.set('Failed to delete contact. Please try again.'),
    });
  }

  getInitials(contact: Contact): string {
    return `${contact.name.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase();
  }
}
