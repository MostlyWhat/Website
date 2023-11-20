<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* @gantry-admin/partials/js-translations.html.twig */
class __TwigTemplate_d32496edea78e591eabc78344fb718adc1591c09751f981916f2dc15e554a698 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 1
        echo "<script>
    var G5T = function(key, fallback) {
        var map = {
            GANTRY5_PLATFORM_INHERITING_FROM_X: ";
        // line 4
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_INHERITING_FROM_X"));
        echo ",
            GANTRY5_PLATFORM_JS_LOADING: ";
        // line 5
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_LOADING"));
        echo ",
            GANTRY5_PLATFORM_JS_PROCESSING: ";
        // line 6
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_PROCESSING"));
        echo ",
            GANTRY5_PLATFORM_JS_LM_SETTINGS: ";
        // line 7
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_LM_SETTINGS"));
        echo ",
            GANTRY5_PLATFORM_JS_LM_CONFIGURE_SETTINGS: ";
        // line 8
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_LM_CONFIGURE_SETTINGS"));
        echo ",
            GANTRY5_PLATFORM_JS_LM_ADD_ROW: ";
        // line 9
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_LM_ADD_ROW"));
        echo ",
            GANTRY5_PLATFORM_JS_LM_DISABLED_PARTICLE: ";
        // line 10
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_LM_DISABLED_PARTICLE"));
        echo ",
            GANTRY5_PLATFORM_JS_LM_GRID_EQUALIZE: ";
        // line 11
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_LM_GRID_EQUALIZE"));
        echo ",
            GANTRY5_PLATFORM_JS_LM_GRID_SORT_MOVE: ";
        // line 12
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_LM_GRID_SORT_MOVE"));
        echo ",
            GANTRY5_PLATFORM_JS_LM_SIZE_LIMITS_RANGE: ";
        // line 13
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_LM_SIZE_LIMITS_RANGE"));
        echo ",
            GANTRY5_PLATFORM_JS_REVIEW_FIELDS: ";
        // line 14
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_REVIEW_FIELDS"));
        echo ",
            GANTRY5_PLATFORM_JS_INVALID_FIELDS: ";
        // line 15
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_INVALID_FIELDS"));
        echo ",
            GANTRY5_PLATFORM_JS_PARTICLE_SETTINGS_APPLIED: ";
        // line 16
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_PARTICLE_SETTINGS_APPLIED"));
        echo ",
            GANTRY5_PLATFORM_JS_MENU_SETTINGS_APPLIED: ";
        // line 17
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_MENU_SETTINGS_APPLIED"));
        echo ",
            GANTRY5_PLATFORM_JS_GENERIC_SETTINGS_APPLIED: ";
        // line 18
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_GENERIC_SETTINGS_APPLIED"));
        echo ",
            GANTRY5_PLATFORM_JS_SETTINGS_APPLIED: ";
        // line 19
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_SETTINGS_APPLIED"));
        echo ",
            GANTRY5_PLATFORM_JS_POSITIONS_SETTINGS_APPLIED: ";
        // line 20
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_POSITIONS_SETTINGS_APPLIED"));
        echo ",
            GANTRY5_PLATFORM_JS_FILTER_MISMATCH: ";
        // line 21
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_FILTER_MISMATCH"));
        echo ",
            GANTRY5_PLATFORM_JUST_NOW: ";
        // line 22
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JUST_NOW"));
        echo ",
            GANTRY5_PLATFORM_JS_KEYVALUE_DUPLICATE: ";
        // line 23
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_KEYVALUE_DUPLICATE"));
        echo ",
            GANTRY5_PLATFORM_JS_KEYVALUE_EXCLUDED: ";
        // line 24
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_KEYVALUE_EXCLUDED"));
        echo ",
            GANTRY5_PLATFORM_JS_NO_SAVE_DETECTED: ";
        // line 25
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_NO_SAVE_DETECTED"));
        echo ",
            GANTRY5_PLATFORM_SAVED: ";
        // line 26
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_SAVED"));
        echo ",
            GANTRY5_PLATFORM_LAST_SAVED: ";
        // line 27
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_LAST_SAVED"));
        echo ",
            GANTRY5_PLATFORM_JS_CSS_COMPILED: ";
        // line 28
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_CSS_COMPILED"));
        echo ",
            GANTRY5_PLATFORM_JS_SAVE_SUCCESS: ";
        // line 29
        echo twig_jsonencode_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_JS_SAVE_SUCCESS"));
        echo ",
        };

        return map[key] || fallback || key;
    };
</script>
";
    }

    public function getTemplateName()
    {
        return "@gantry-admin/partials/js-translations.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  135 => 29,  131 => 28,  127 => 27,  123 => 26,  119 => 25,  115 => 24,  111 => 23,  107 => 22,  103 => 21,  99 => 20,  95 => 19,  91 => 18,  87 => 17,  83 => 16,  79 => 15,  75 => 14,  71 => 13,  67 => 12,  63 => 11,  59 => 10,  55 => 9,  51 => 8,  47 => 7,  43 => 6,  39 => 5,  35 => 4,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "@gantry-admin/partials/js-translations.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\partials\\js-translations.html.twig");
    }
}
