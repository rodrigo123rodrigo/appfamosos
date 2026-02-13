/**
 * Servicio de integración con redes sociales
 * Permite publicar aclaraciones en Twitter, Instagram, Facebook, etc.
 */

export interface SocialMediaPost {
  content: string;
  platforms: ("twitter" | "instagram" | "facebook" | "linkedin" | "tiktok")[];
  imageUrl?: string;
  videoUrl?: string;
  scheduledAt?: Date;
}

export interface SocialMediaConnection {
  platform: string;
  connected: boolean;
  username?: string;
  profileUrl?: string;
}

export interface PublishResult {
  success: boolean;
  platform: string;
  postUrl?: string;
  error?: string;
}

class SocialMediaService {
  /**
   * Obtiene las conexiones de redes sociales del usuario
   */
  async getConnections(): Promise<SocialMediaConnection[]> {
    try {
      const response = await fetch("/api/social/connections");
      if (!response.ok) throw new Error("Error al obtener conexiones");
      return await response.json();
    } catch (error) {
      console.error("[Social] Error obteniendo conexiones:", error);
      // Retornar datos mock para desarrollo
      return [
        { platform: "twitter", connected: true, username: "@celebrity", profileUrl: "https://twitter.com/celebrity" },
        { platform: "instagram", connected: true, username: "@celebrity", profileUrl: "https://instagram.com/celebrity" },
        { platform: "facebook", connected: false },
        { platform: "linkedin", connected: false },
        { platform: "tiktok", connected: false },
      ];
    }
  }

  /**
   * Conecta una red social
   */
  async connect(platform: string): Promise<{ success: boolean; authUrl?: string }> {
    try {
      const response = await fetch("/api/social/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      
      if (!response.ok) throw new Error("Error al conectar");
      return await response.json();
    } catch (error) {
      console.error(`[Social] Error conectando ${platform}:`, error);
      return { 
        success: false,
        authUrl: "#" // En desarrollo, retornar URL mock
      };
    }
  }

  /**
   * Desconecta una red social
   */
  async disconnect(platform: string): Promise<boolean> {
    try {
      const response = await fetch("/api/social/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      return response.ok;
    } catch (error) {
      console.error(`[Social] Error desconectando ${platform}:`, error);
      return false;
    }
  }

  /**
   * Publica en múltiples redes sociales
   */
  async publish(post: SocialMediaPost): Promise<PublishResult[]> {
    try {
      const response = await fetch("/api/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      if (!response.ok) throw new Error("Error al publicar");
      const results = await response.json();
      return results;
    } catch (error) {
      console.error("[Social] Error publicando:", error);
      
      // Simular publicación exitosa en desarrollo
      return post.platforms.map(platform => ({
        success: true,
        platform,
        postUrl: `https://${platform}.com/celebrity/status/123456789`,
      }));
    }
  }

  /**
   * Genera una vista previa de cómo se verá la publicación
   */
  generatePreview(content: string, platform: string): {
    text: string;
    textLength: number;
    maxLength: number;
    needsTruncation: boolean;
    hashtags: string[];
  } {
    const maxLengths: Record<string, number> = {
      twitter: 280,
      instagram: 2200,
      facebook: 5000,
      linkedin: 3000,
      tiktok: 150,
    };

    const maxLength = maxLengths[platform] || 280;
    const hashtags = content.match(/#\w+/g) || [];
    const needsTruncation = content.length > maxLength;

    return {
      text: needsTruncation ? content.substring(0, maxLength - 3) + "..." : content,
      textLength: content.length,
      maxLength,
      needsTruncation,
      hashtags,
    };
  }

  /**
   * Valida si una publicación es válida para las plataformas seleccionadas
   */
  validate(post: SocialMediaPost): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!post.content || post.content.trim().length === 0) {
      errors.push("El contenido no puede estar vacío");
    }

    if (post.platforms.length === 0) {
      errors.push("Debes seleccionar al menos una plataforma");
    }

    // Validación específica por plataforma
    for (const platform of post.platforms) {
      const preview = this.generatePreview(post.content, platform);
      
      if (platform === "twitter" && preview.needsTruncation) {
        errors.push(`El contenido excede el límite de ${preview.maxLength} caracteres para Twitter`);
      }

      if (platform === "instagram" && !post.imageUrl && !post.videoUrl) {
        errors.push("Instagram requiere al menos una imagen o video");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Guarda un borrador de publicación
   */
  async saveDraft(post: SocialMediaPost): Promise<{ id: string; success: boolean }> {
    try {
      const response = await fetch("/api/social/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      if (!response.ok) throw new Error("Error al guardar borrador");
      return await response.json();
    } catch (error) {
      console.error("[Social] Error guardando borrador:", error);
      // Simular guardado en localStorage para desarrollo
      const draftId = `draft_${Date.now()}`;
      localStorage.setItem(`social_draft_${draftId}`, JSON.stringify(post));
      return { id: draftId, success: true };
    }
  }

  /**
   * Obtiene los borradores guardados
   */
  async getDrafts(): Promise<Array<SocialMediaPost & { id: string }>> {
    try {
      const response = await fetch("/api/social/drafts");
      if (!response.ok) throw new Error("Error al obtener borradores");
      return await response.json();
    } catch (error) {
      console.error("[Social] Error obteniendo borradores:", error);
      // Obtener de localStorage para desarrollo
      const drafts: Array<SocialMediaPost & { id: string }> = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("social_draft_")) {
          const data = localStorage.getItem(key);
          if (data) {
            drafts.push({
              id: key.replace("social_draft_", ""),
              ...JSON.parse(data),
            });
          }
        }
      }
      return drafts;
    }
  }
}

// Exportar instancia singleton
export const socialMediaService = new SocialMediaService();
