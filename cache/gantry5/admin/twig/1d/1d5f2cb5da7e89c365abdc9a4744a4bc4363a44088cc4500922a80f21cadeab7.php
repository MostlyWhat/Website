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

/* @gantry-admin/ajax/filepicker.html.twig */
class __TwigTemplate_1803877169e355e8d2e94b4be6db7c98a5d57c597bdea01efd22c1a7ac58ae1b extends \Twig\Template
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
        $context["files_mode"] = _twig_default_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->jsonDecodeFilter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->getCookie("g5_files_mode")), "thumbnails");
        // line 2
        echo "
<div class=\"g-particles-header filepicker-header settings-block clearfix\">
    <div class=\"float-right files-mode\">
        <div class=\"file-mode";
        // line 5
        echo (((($context["files_mode"] ?? null) == "thumbnails")) ? (" active") : (""));
        echo "\" data-files-mode=\"thumbnails\"><i class=\"fa fa-th-large\" aria-hidden=\"true\"></i></div>
        <div class=\"file-mode";
        // line 6
        echo (((($context["files_mode"] ?? null) == "list")) ? (" active") : (""));
        echo "\" data-files-mode=\"list\"><i class=\"fa fa-th-list\" aria-hidden=\"true\"></i></div>
    </div>
</div>
<div class=\"g-particles-main icons-wrapper g-grid\">
    <div class=\"folders g-block size-30\">
        <ul class=\"g-bookmarks\">
            ";
        // line 12
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["bookmarks"] ?? null));
        $context['loop'] = [
          'parent' => $context['_parent'],
          'index0' => 0,
          'index'  => 1,
          'first'  => true,
        ];
        if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
            $length = count($context['_seq']);
            $context['loop']['revindex0'] = $length - 1;
            $context['loop']['revindex'] = $length;
            $context['loop']['length'] = $length;
            $context['loop']['last'] = 1 === $length;
        }
        foreach ($context['_seq'] as $context["index"] => $context["bookmark"]) {
            // line 13
            echo "                <li class=\"g-bookmark";
            echo ((twig_in_filter($context["index"], ($context["active"] ?? null))) ? (" selected") : (""));
            echo "\">
                    <span class=\"g-bookmark-title\" title=\"";
            // line 14
            echo twig_escape_filter($this->env, $context["index"], "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $context["index"], "html", null, true);
            echo " <i class=\"g-bookmark-collapse fa fa-fw fa-minus\"></i></span>
                    <ul class=\"g-folders fa-ul\">
                        ";
            // line 16
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($context["bookmark"]);
            $context['loop'] = [
              'parent' => $context['_parent'],
              'index0' => 0,
              'index'  => 1,
              'first'  => true,
            ];
            if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
                $length = count($context['_seq']);
                $context['loop']['revindex0'] = $length - 1;
                $context['loop']['revindex'] = $length;
                $context['loop']['length'] = $length;
                $context['loop']['last'] = 1 === $length;
            }
            foreach ($context['_seq'] as $context["_key"] => $context["folder"]) {
                // line 17
                echo "                            <li";
                echo ((twig_in_filter($context["folder"], ($context["active"] ?? null))) ? (" class=\"selected active\"") : (""));
                echo " data-folder=\"";
                echo twig_escape_filter($this->env, twig_jsonencode_filter(["pathname" => $context["folder"]]), "html_attr");
                echo "\">
                                <i class=\"fa-li far fa-folder\" aria-hidden=\"true\"></i> <span class=\"path\" title=\"";
                // line 18
                echo twig_escape_filter($this->env, $context["folder"], "html", null, true);
                echo "\">";
                echo twig_escape_filter($this->env, $context["folder"], "html", null, true);
                echo "</span>
                            </li>
                            ";
                // line 20
                $this->loadTemplate("ajax/filepicker/subfolders.html.twig", "@gantry-admin/ajax/filepicker.html.twig", 20)->display(twig_array_merge($context, ["folder" => $this->getAttribute($this->getAttribute(($context["folders"] ?? null), $context["index"]), $context["folder"]), "active" => ($context["active"] ?? null)]));
                // line 21
                echo "                        ";
                ++$context['loop']['index0'];
                ++$context['loop']['index'];
                $context['loop']['first'] = false;
                if (isset($context['loop']['length'])) {
                    --$context['loop']['revindex0'];
                    --$context['loop']['revindex'];
                    $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                }
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['folder'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 22
            echo "                    </ul>
                </li>
            ";
            ++$context['loop']['index0'];
            ++$context['loop']['index'];
            $context['loop']['first'] = false;
            if (isset($context['loop']['length'])) {
                --$context['loop']['revindex0'];
                --$context['loop']['revindex'];
                $context['loop']['last'] = 0 === $context['loop']['revindex0'];
            }
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['index'], $context['bookmark'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 25
        echo "            ";
        // line 28
        echo "        </ul>
    </div>
    <div class=\"g-files g-block g-filemode-";
        // line 30
        echo twig_escape_filter($this->env, ($context["files_mode"] ?? null), "html", null, true);
        echo "\">
        ";
        // line 31
        $this->loadTemplate("ajax/filepicker/files.html.twig", "@gantry-admin/ajax/filepicker.html.twig", 31)->display(twig_array_merge($context, ["files" => ($context["files"] ?? null), "value" => ($context["value"] ?? null)]));
        // line 32
        echo "    </div>
</div>
";
        // line 35
        echo "<div class=\"g-particles-footer settings-block clearfix\">
    <div class=\"float-left footer-upload-info font-small\">
        ";
        // line 37
        echo $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_FILEPICKER_UPLOAD_DESC");
        echo "
        <br/>
        ";
        // line 39
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_FILEPICKER_CURRENT_FILTERS"), "html", null, true);
        echo " ";
        echo ((($context["filter"] ?? null)) ? ((("<code>" . ($context["filter"] ?? null)) . "</code>")) : ((("<strong>" . $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_FILEPICKER_NO_FILTER")) . "</strong>")));
        // line 40
        echo "
    </div>
    <div class=\"float-right\">
        <button href=\"#\" class=\"button button-primary\" data-select=\"\">";
        // line 43
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_SELECT"), "html", null, true);
        echo "</button>
        <button href=\"#\" class=\"button g5-dialog-close\">";
        // line 44
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_CANCEL"), "html", null, true);
        echo "</button>
    </div>
</div>
";
    }

    public function getTemplateName()
    {
        return "@gantry-admin/ajax/filepicker.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  180 => 44,  176 => 43,  171 => 40,  167 => 39,  162 => 37,  158 => 35,  154 => 32,  152 => 31,  148 => 30,  144 => 28,  142 => 25,  126 => 22,  112 => 21,  110 => 20,  103 => 18,  96 => 17,  79 => 16,  72 => 14,  67 => 13,  50 => 12,  41 => 6,  37 => 5,  32 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "@gantry-admin/ajax/filepicker.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\ajax\\filepicker.html.twig");
    }
}
