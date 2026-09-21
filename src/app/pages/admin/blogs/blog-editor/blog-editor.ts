import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogPayload } from '../../../../models/blog.model';
import { BlogService } from '../../../../services/blog';

@Component({
  selector: 'app-blog-editor',
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-editor.html',
  styleUrl: './blog-editor.scss',
})
export class BlogEditor implements OnInit, AfterViewInit {
  //   ngAfterViewInit(): void {
  //     this.editorInitialised = true;

  //     this.syncEditorDom();
  //   }

  //   private syncEditorDom(): void {
  //   if (!this.editorInitialised || !this.editor) {
  //     return;
  //   }

  //   const element = this.editor.nativeElement;

  //   /*
  //    * Only write content into the editor when
  //    * Angular is not actively being edited.
  //    */
  //   if (element.innerHTML !== this.content) {
  //     element.innerHTML = this.content;
  //   }
  // }
  //   readonly isEditMode = signal(false);

  //   readonly isLoading = signal(false);

  //   readonly isSaving = signal(false);

  //   readonly isUploading = signal(false);

  //   readonly errorMessage = signal('');

  //   readonly successMessage = signal('');

  //   title = '';
  //   authorName = '';
  //   content = '';
  //   featuredImage: string | null = null;

  //   readonly maxCharacters = 2000;

  //   blogId: number | null = null;

  //   constructor(
  //     private readonly route: ActivatedRoute,
  //     private readonly router: Router,
  //     private readonly blogService: BlogService,
  //   ) {}

  //   async ngOnInit(): Promise<void> {
  //     const idParam = this.route.snapshot.paramMap.get('id');

  //     if (!idParam) {
  //       return;
  //     }

  //     const id = Number(idParam);

  //     if (!Number.isInteger(id)) {
  //       this.errorMessage.set('Invalid blog ID.');

  //       return;
  //     }

  //     this.blogId = id;

  //     this.isEditMode.set(true);

  //     await this.loadBlog(id);
  //   }

  //   async loadBlog(id: number): Promise<void> {
  //     this.isLoading.set(true);
  //     this.errorMessage.set('');

  //     try {
  //       const blog = await this.blogService.getBlogById(id);

  //       if (!blog) {
  //         throw new Error('Blog article was not found.');
  //       }

  //       this.title = blog.title;
  //       this.authorName = blog.author_name;
  //       this.content = blog.content;
  //       this.featuredImage = blog.featured_image;
  //     } catch (error) {
  //       this.errorMessage.set(error instanceof Error ? error.message : 'Unable to load this blog.');
  //     } finally {
  //       this.isLoading.set(false);
  //     }
  //   }

  //   onContentInput(event: Event): void {
  //     const target = event.target as HTMLElement;

  //     const text = target.innerText.replace(/\u00a0/g, ' ').trim();

  //     if (text.length > this.maxCharacters) {
  //       const limited = text.slice(0, this.maxCharacters);

  //       target.innerText = limited;

  //       this.placeCursorAtEnd();
  //     }

  //     this.content = target.innerHTML;
  //   }

  //   get characterCount(): number {
  //     const text = this.content
  //       .replace(/<[^>]*>/g, ' ')
  //       .replace(/\s+/g, ' ')
  //       .trim();

  //     return text.length;
  //   }

  //   private placeCursorAtEnd(): void {
  //     const selection = window.getSelection();

  //     const editor = document.querySelector('[contenteditable="true"]');

  //     if (!selection || !editor) {
  //       return;
  //     }

  //     selection.selectAllChildren(editor);

  //     selection.collapseToEnd();
  //   }

  //   execCommand(command: string, value = ''): void {
  //     document.execCommand(command, false, value);

  //     this.syncContentFromEditor();
  //   }

  //   formatBlock(tag: string): void {
  //     document.execCommand('formatBlock', false, tag);

  //     this.syncContentFromEditor();
  //   }

  //   private syncContentFromEditor(): void {
  //     const editor = document.querySelector('[contenteditable="true"]') as HTMLElement | null;

  //     if (!editor) {
  //       return;
  //     }

  //     this.content = editor.innerHTML;
  //   }

  //   async uploadFeaturedImage(event: Event): Promise<void> {
  //     const input = event.target as HTMLInputElement;

  //     const file = input.files?.[0];

  //     if (!file) {
  //       return;
  //     }

  //     this.errorMessage.set('');
  //     this.isUploading.set(true);

  //     try {
  //       this.featuredImage = await this.blogService.uploadImage(file);
  //     } catch (error) {
  //       this.errorMessage.set(error instanceof Error ? error.message : 'Unable to upload image.');
  //     } finally {
  //       this.isUploading.set(false);

  //       input.value = '';
  //     }
  //   }

  //   async save(): Promise<void> {
  //     this.errorMessage.set('');
  //     this.successMessage.set('');

  //     const cleanTitle = this.title.trim();

  //     const cleanAuthor = this.authorName.trim();

  //     const plainText = this.content
  //       .replace(/<[^>]*>/g, ' ')
  //       .replace(/\s+/g, ' ')
  //       .trim();

  //     if (!cleanTitle) {
  //       this.errorMessage.set('Enter a blog title.');

  //       return;
  //     }

  //     if (!cleanAuthor) {
  //       this.errorMessage.set('Enter the author name.');

  //       return;
  //     }

  //     if (!plainText) {
  //       this.errorMessage.set('Enter the blog content.');

  //       return;
  //     }

  //     if (plainText.length > this.maxCharacters) {
  //       this.errorMessage.set(`Blog content cannot exceed ${this.maxCharacters} characters.`);

  //       return;
  //     }

  //     const payload: BlogPayload = {
  //       title: cleanTitle,
  //       author_name: cleanAuthor,
  //       content: this.content,
  //       featured_image: this.featuredImage,
  //     };

  //     this.isSaving.set(true);

  //     try {
  //       if (this.isEditMode() && this.blogId) {
  //         await this.blogService.updateBlog(this.blogId, payload);

  //         this.successMessage.set('Blog updated successfully.');
  //       } else {
  //         await this.blogService.createBlog(payload);

  //         this.successMessage.set('Blog created successfully.');

  //         this.title = '';
  //         this.authorName = '';
  //         this.content = '';
  //         this.featuredImage = null;

  //         await this.router.navigate(['/admin/blogs']);
  //       }
  //     } catch (error) {
  //       this.errorMessage.set(error instanceof Error ? error.message : 'Unable to save the blog.');
  //     } finally {
  //       this.isSaving.set(false);
  //     }
  //   }

  /*
   * Direct reference to the actual
   * contenteditable element.
   *
   * This is important because we should
   * read from the editor while typing,
   * instead of continuously writing content
   * back into it through [innerHTML].
   */
  @ViewChild('editor')
  private editor?: ElementRef<HTMLDivElement>;

  private editorInitialised = false;

  readonly isEditMode = signal(false);

  readonly isLoading = signal(false);

  readonly isSaving = signal(false);

  readonly isUploading = signal(false);

  readonly errorMessage = signal('');

  readonly successMessage = signal('');

  title = '';

  authorName = '';

  content = '';

  featuredImage: string | null = null;

  readonly maxCharacters = 2000;

  blogId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly blogService: BlogService,
  ) {}

  /*
   * =========================================================
   * LIFECYCLE
   * =========================================================
   */

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');

    /*
     * New blog
     */
    if (!idParam) {
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id)) {
      this.errorMessage.set('Invalid blog ID.');

      return;
    }

    this.blogId = id;

    this.isEditMode.set(true);

    await this.loadBlog(id);
  }

  ngAfterViewInit(): void {
    this.editorInitialised = true;

    /*
     * Handles the case where editor content
     * has already been assigned before the
     * view became available.
     */
    this.syncEditorDom();
  }

  get featuredImagePreviewUrl(): string | null {
    return this.blogService.resolveImageUrl(this.featuredImage);
  }
  /*
   * =========================================================
   * LOAD BLOG
   * =========================================================
   */

  async loadBlog(id: number): Promise<void> {
    this.isLoading.set(true);

    this.errorMessage.set('');

    try {
      const blog = await this.blogService.getBlogById(id);

      if (!blog) {
        throw new Error('Blog article was not found.');
      }

      this.title = blog.title;

      this.authorName = blog.author_name;

      this.content = blog.content;

      this.featuredImage = blog.featured_image;

      /*
       * The ViewChild may already exist
       * for edit mode. If it does, place
       * the loaded HTML directly into it.
       */
      this.syncEditorDom();
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to load this blog.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /*
   * =========================================================
   * EDITOR INPUT
   * =========================================================
   */

  onContentInput(event: Event): void {
    const target = event.target as HTMLDivElement;

    if (!target) {
      return;
    }

    const text = target.innerText.replace(/\u00a0/g, ' ').trim();

    /*
     * Enforce the 2000 character limit.
     */
    if (text.length > this.maxCharacters) {
      const limited = text.slice(0, this.maxCharacters);

      target.innerText = limited;

      this.placeCursorAtEnd();
    }

    /*
     * IMPORTANT:
     *
     * Read from the editor.
     *
     * Do NOT write this.content back
     * into the editor here.
     *
     * That was causing the caret to jump
     * and text to appear backwards.
     */
    this.content = target.innerHTML;
  }

  /*
   * =========================================================
   * CHARACTER COUNT
   * =========================================================
   */

  get characterCount(): number {
    const text = this.content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return text.length;
  }

  /*
   * =========================================================
   * CURSOR
   * =========================================================
   */

  private placeCursorAtEnd(): void {
    const editor = this.editor?.nativeElement;

    const selection = window.getSelection();

    if (!selection || !editor) {
      return;
    }

    selection.selectAllChildren(editor);

    selection.collapseToEnd();
  }

  /*
   * =========================================================
   * RICH TEXT COMMANDS
   * =========================================================
   */

  execCommand(command: string, value = ''): void {
    /*
     * Make sure the editor exists.
     */
    if (!this.editor) {
      return;
    }

    document.execCommand(command, false, value);

    this.syncContentFromEditor();
  }

  formatBlock(tag: string): void {
    /*
     * Make sure the editor exists.
     */
    if (!this.editor) {
      return;
    }

    document.execCommand('formatBlock', false, tag);

    this.syncContentFromEditor();
  }

  /*
   * =========================================================
   * SYNC EDITOR → COMPONENT
   * =========================================================
   */

  private syncContentFromEditor(): void {
    const editor = this.editor?.nativeElement;

    if (!editor) {
      return;
    }

    this.content = editor.innerHTML;
  }

  /*
   * =========================================================
   * SYNC COMPONENT → EDITOR
   * =========================================================
   *
   * Used only when loading existing
   * content into the editor.
   *
   * We intentionally do NOT use Angular
   * [innerHTML] binding on the editor.
   */

  private syncEditorDom(): void {
    if (!this.editorInitialised || !this.editor) {
      return;
    }

    const element = this.editor.nativeElement;

    if (element.innerHTML !== this.content) {
      element.innerHTML = this.content;
    }
  }

  /*
   * =========================================================
   * FEATURED IMAGE UPLOAD
   * =========================================================
   */

  async uploadFeaturedImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.errorMessage.set('');

    this.isUploading.set(true);

    try {
      this.featuredImage = await this.blogService.uploadImage(file);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to upload image.');
    } finally {
      this.isUploading.set(false);

      /*
       * Allows selecting the same file
       * again later.
       */
      input.value = '';
    }
  }

  /*
   * =========================================================
   * SAVE BLOG
   * =========================================================
   */

  async save(): Promise<void> {
    this.errorMessage.set('');

    this.successMessage.set('');

    /*
     * Make sure the latest editor DOM
     * content is captured before saving.
     */
    this.syncContentFromEditor();

    const cleanTitle = this.title.trim();

    const cleanAuthor = this.authorName.trim();

    const plainText = this.content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanTitle) {
      this.errorMessage.set('Enter a blog title.');

      return;
    }

    if (!cleanAuthor) {
      this.errorMessage.set('Enter the author name.');

      return;
    }

    if (!plainText) {
      this.errorMessage.set('Enter the blog content.');

      return;
    }

    if (plainText.length > this.maxCharacters) {
      this.errorMessage.set(`Blog content cannot exceed ${this.maxCharacters} characters.`);

      return;
    }

    const payload: BlogPayload = {
      title: cleanTitle,

      author_name: cleanAuthor,

      content: this.content,

      featured_image: this.featuredImage,
    };

    this.isSaving.set(true);

    try {
      /*
       * UPDATE
       */
      if (this.isEditMode() && this.blogId) {
        await this.blogService.updateBlog(this.blogId, payload);

        this.successMessage.set('Blog updated successfully.');

        return;
      }

      /*
       * CREATE
       */
      await this.blogService.createBlog(payload);

      this.successMessage.set('Blog created successfully.');

      /*
       * Clear editor state.
       */
      this.title = '';

      this.authorName = '';

      this.content = '';

      this.featuredImage = null;

      /*
       * Clear the actual DOM editor too.
       */
      if (this.editor) {
        this.editor.nativeElement.innerHTML = '';
      }

      await this.router.navigate(['/admin/blogs']);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to save the blog.');
    } finally {
      this.isSaving.set(false);
    }
  }
}
